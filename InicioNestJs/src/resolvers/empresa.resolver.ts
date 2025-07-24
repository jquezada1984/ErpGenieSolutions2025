import { Resolver, Query, Args, Int, Context, ID } from '@nestjs/graphql';
import { Empresa } from '../entities/empresa.entity';
import { EmpresaListDto } from '../dto/empresa-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Resolver(() => Empresa)
export class EmpresaResolver {
  constructor(
    @InjectRepository(Empresa)
    private empresaRepository: Repository<Empresa>,
    private readonly authService: AuthService,
  ) {}

  @Query(() => [EmpresaListDto])
  async empresas(): Promise<EmpresaListDto[]> {
    console.log('🔍 Query empresas ejecutada');
    try {
      const empresas = await this.empresaRepository.find({
        select: ['id_empresa', 'nombre', 'ruc', 'direccion', 'telefono', 'email', 'estado'],
        relations: ['moneda', 'pais', 'provincia', 'identificacion', 'redes_sociales', 'horarios_apertura']
      });
      console.log(`✅ ${empresas.length} empresas encontradas`);
      return empresas;
    } catch (error) {
      console.error('❌ Error en query empresas:', error);
      throw error;
    }
  }

  @Query(() => Empresa, { nullable: true })
  async empresa(@Args('id_empresa', { type: () => ID }) id_empresa: string): Promise<Empresa | null> {
    return this.empresaRepository.findOne({ 
      where: { id_empresa },
      relations: ['moneda', 'pais', 'provincia', 'identificacion', 'redes_sociales', 'horarios_apertura']
    });
  }

  // Nuevo: Query para refrescar el token
  @Query(() => String)
  async refreshToken(@Context() context): Promise<string> {
    // Aquí deberías obtener el usuario autenticado desde el contexto
    // Por simplicidad, asumimos que el usuario está en context.req.user
    const user = context.req.user;
    if (!user) throw new NotFoundException('Usuario no autenticado');
    // Generar un nuevo token usando el AuthService
    const result = await this.authService.login(user);
    return result.access_token;
  }

  // Mutaciones deshabilitadas por arquitectura:
  // @Mutation(() => Empresa)
  // async crearEmpresa(...) { ... }
  // @Mutation(() => Empresa, { nullable: true })
  // async actualizarEmpresa(...) { ... }
  // @Mutation(() => Boolean)
  // async eliminarEmpresa(...) { ... }
} 