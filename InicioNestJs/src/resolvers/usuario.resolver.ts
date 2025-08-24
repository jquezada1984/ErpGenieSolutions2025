import { Resolver, Query, Mutation, Args, Int, ID, Context } from '@nestjs/graphql';
import { Usuario } from '../entities/usuario.entity';
import { UsuarioListDto } from '../dto/usuario-list.dto';
import { MeResponse } from '../dto/me.response';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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

  @Query(() => [UsuarioListDto])
  @UseGuards(GqlAuthGuard)
  async usuarios(): Promise<UsuarioListDto[]> {
    return this.usuarioRepository.find({
      select: ['id_usuario', 'username', 'nombre_completo', 'email', 'estado']
    });
  }

  @Query(() => Usuario, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async usuario(@Args('id_usuario', { type: () => ID }) id_usuario: string): Promise<Usuario | null> {
    return this.usuarioRepository.findOne({ where: { id_usuario } });
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
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('username') username: string,
    @Args('password') password: string,
    @Args('nombre_completo', { nullable: true }) nombre_completo?: string,
    @Args('email', { nullable: true }) email?: string,
  ): Promise<Usuario> {
    // Hashear la contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // Prepara el payload para el microservicio Python
    const payload = {
      id_empresa,
      id_perfil,
      username,
      password_hash,
      nombre_completo,
      email,
    };

    // Llama al microservicio Python
    await lastValueFrom(this.httpService.post('http://localhost:5000/api/usuario', payload));

    // Opcional: guardar también en la base local
    const usuario = this.usuarioRepository.create({ ...payload });
    return this.usuarioRepository.save(usuario);
  }

  @Mutation(() => Usuario, { nullable: true })
  @UseGuards(GqlAuthGuard)
  async actualizarUsuario(
    @Args('id_usuario', { type: () => ID }) id_usuario: string,
    @Args('id_empresa', { type: () => ID, nullable: true }) id_empresa?: string,
    @Args('id_perfil', { type: () => ID, nullable: true }) id_perfil?: string,
    @Args('username', { nullable: true }) username?: string,
    @Args('password', { nullable: true }) password?: string,
    @Args('nombre_completo', { nullable: true }) nombre_completo?: string,
    @Args('email', { nullable: true }) email?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
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
    };
    // Llama al microservicio Python (PUT)
    await lastValueFrom(this.httpService.put(`http://localhost:5000/api/usuario/${usuario.id_usuario}`, payload));

    return this.usuarioRepository.save(usuario);
  }

  @Mutation(() => Boolean)
  @UseGuards(GqlAuthGuard)
  async eliminarUsuario(@Args('id_usuario', { type: () => ID }) id_usuario: string): Promise<boolean> {
    const result = await this.usuarioRepository.delete(id_usuario);
    return (result.affected || 0) > 0;
  }
} 