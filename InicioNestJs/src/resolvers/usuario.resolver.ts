import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioListDto } from '../dto/usuario-list.dto';
import { MeResponse } from '../dto/me.response';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/gql-auth.guard';
import { HttpService } from '@nestjs/axios';
import * as bcrypt from 'bcryptjs';
import { lastValueFrom } from 'rxjs';

@Resolver(() => Usuario)
export class UsuarioResolver {
  constructor(
    @InjectRepository(Usuario)
    private readonly usuarioRepository: Repository<Usuario>,
    private readonly httpService: HttpService,
  ) {}

  @Query(() => String)
  async test(): Promise<string> {
    return "Test query working!";
  }

  /** true si el JWT permite ver usuarios de todas las empresas */
  private isScopeGlobal(scope: string | undefined): boolean {
    return String(scope ?? 'EMPRESA').trim().toUpperCase() === 'GLOBAL';
  }

  private pythonBaseUrl(): string {
    return (process.env.PYTHON_SERVICE_URL || 'http://localhost:5000').replace(/\/$/, '');
  }

  /** Reenvía el Bearer del cliente a Flask (@jwt_required); sin esto Flask responde 422 (token inválido). */
  private authHeadersFromContext(context: { req?: { headers?: Record<string, unknown> } }): { Authorization: string } | undefined {
    const raw = context.req?.headers?.authorization;
    const v = Array.isArray(raw) ? raw[0] : raw;
    if (typeof v === 'string' && v.trim().length > 0) {
      return { Authorization: v };
    }
    return undefined;
  }

  @Query(() => [UsuarioListDto])
  @UseGuards(GqlAuthGuard)
  async usuarios(@Context() context: { req: { user?: { id_empresa?: string; scope_acceso?: string } } }): Promise<UsuarioListDto[]> {
    const user = context.req?.user;
    const where: FindOptionsWhere<Usuario> = {};
    if (!this.isScopeGlobal(user?.scope_acceso)) {
      if (!user?.id_empresa) {
        return [];
      }
      where.id_empresa = user.id_empresa;
    }

    try {
      return await this.usuarioRepository.find({
        where,
        relations: ['empresa', 'perfil'],
        order: { created_at: 'DESC' },
      });
    } catch (err) {
      console.warn('usuarios: order by created_at failed, retrying without', err?.message);
      return this.usuarioRepository.find({
        where,
        relations: ['empresa', 'perfil'],
        order: { username: 'ASC' },
      });
    }
  }

  @Query(() => Usuario, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async usuario(
    @Args('id_usuario', { type: () => ID }) id_usuario: string,
    @Context() context: { req: { user?: { id_empresa?: string; scope_acceso?: string } } },
  ): Promise<Usuario | null> {
    const row = await this.usuarioRepository.findOne({
      where: { id_usuario },
      relations: ['empresa', 'perfil'],
    });
    if (!row) {
      return null;
    }
    const user = context.req?.user;
    if (!this.isScopeGlobal(user?.scope_acceso) && user?.id_empresa && row.id_empresa !== user.id_empresa) {
      return null;
    }
    return row;
  }

  @Query(() => MeResponse, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async me(@Context() context): Promise<MeResponse | null> {
    try {
      const user = context.req.user;
      if (!user || !user.sub) {
        return null;
      }
      
      const usuario = await this.usuarioRepository.findOne({ 
        where: { id_usuario: user.sub },
        relations: ['perfil', 'perfil.empresa']
      });

      if (!usuario) {
        return null;
      }

      return {
        user: usuario
      };
    } catch (error) {
      console.error('Error en query me:', error);
      return null;
    }
  }

  @Mutation(() => Usuario)
  @UseGuards(GqlAuthGuard)
  async crearUsuario(
    @Context() context: { req?: { user?: { scope_acceso?: string }; headers?: Record<string, unknown> } },
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('nombre_completo', { nullable: true }) nombre_completo?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('scope_acceso', { nullable: true }) scope_acceso?: string,
  ): Promise<Usuario> {
    // Hashear la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    const caller = context.req?.user;
    let effectiveScope = 'EMPRESA';
    if (this.isScopeGlobal(caller?.scope_acceso)) {
      const raw = scope_acceso != null && String(scope_acceso).trim() !== '' ? String(scope_acceso).trim().toUpperCase() : '';
      if (raw === 'GLOBAL' || raw === 'EMPRESA') {
        effectiveScope = raw;
      }
    }

    // Prepara el payload para el microservicio Python
    const payload = {
      id_empresa,
      id_perfil,
      username,
      password_hash,
      nombre_completo,
      email,
      scope_acceso: effectiveScope,
    };

    await lastValueFrom(
      this.httpService.post(`${this.pythonBaseUrl()}/api/usuario`, payload, {
        headers: this.authHeadersFromContext(context),
      }),
    );

    const usuario = this.usuarioRepository.create({
      id_empresa,
      id_perfil,
      username,
      password_hash,
      nombre_completo,
      email,
      scope_acceso: effectiveScope,
    });
    return this.usuarioRepository.save(usuario);
  }

  @Mutation(() => Usuario, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async actualizarUsuario(
    @Args('id_usuario', { type: () => ID }) id_usuario: string,
    @Context() context: { req?: { user?: { scope_acceso?: string }; headers?: Record<string, unknown> } },
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_perfil', { type: () => ID, nullable: true }) id_perfil?: string,
    @Args('username', { nullable: true }) username?: string,
    @Args('password', { nullable: true }) password?: string,
    @Args('nombre_completo', { nullable: true }) nombre_completo?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
    @Args('scope_acceso', { nullable: true }) scope_acceso?: string,
  ): Promise<Usuario | null> {
    const usuario = await this.usuarioRepository.findOne({ where: { id_usuario } });
    if (!usuario) throw new NotFoundException('Usuario no encontrado');
    if (id_empresa !== undefined) usuario.id_empresa = id_empresa;
    if (id_perfil !== undefined) usuario.id_perfil = id_perfil;
    if (username !== undefined) usuario.username = username;
    if (password !== undefined) {
      usuario.password_hash = await bcrypt.hash(password, 10);
    }
    if (nombre_completo !== undefined) usuario.nombre_completo = nombre_completo;
    if (email !== undefined) usuario.email = email;
    if (estado !== undefined) usuario.estado = estado;

    const caller = context.req?.user;
    if (this.isScopeGlobal(caller?.scope_acceso) && scope_acceso !== undefined && scope_acceso !== null) {
      const s = String(scope_acceso).trim().toUpperCase();
      if (s === 'GLOBAL' || s === 'EMPRESA') {
        usuario.scope_acceso = s;
      }
    }

    // Prepara el payload para el microservicio Python
    const payload = {
      id_usuario: usuario.id_usuario,
      id_empresa: usuario.id_empresa,
      id_perfil: usuario.id_perfil,
      username: usuario.username,
      password_hash: usuario.password_hash,
      nombre_completo: usuario.nombre_completo,
      email: usuario.email,
      estado: usuario.estado,
      scope_acceso: usuario.scope_acceso,
    };
    await lastValueFrom(
      this.httpService.put(`${this.pythonBaseUrl()}/api/usuario/${usuario.id_usuario}`, payload, {
        headers: this.authHeadersFromContext(context),
      }),
    );

    return this.usuarioRepository.save(usuario);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async eliminarUsuario(@Args('id_usuario', { type: () => ID }) id_usuario: string): Promise<boolean> {
    const result = await this.usuarioRepository.delete(id_usuario);
    return (result.affected || 0) > 0;
  }
} 