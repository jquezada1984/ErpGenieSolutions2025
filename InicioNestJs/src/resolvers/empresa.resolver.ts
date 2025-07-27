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
    console.log('🔍 Query empresa ejecutada para ID:', id_empresa);
    try {
      // Primero hacer una consulta directa para verificar
      const empresaDirecta = await this.empresaRepository
        .createQueryBuilder('empresa')
        .select([
          'empresa.id_empresa',
          'empresa.nombre',
          'empresa.ruc',
          'empresa.direccion',
          'empresa.telefono',
          'empresa.email',
          'empresa.estado',
          'empresa.id_moneda',
          'empresa.id_pais',
          'empresa.codigo_postal',
          'empresa.poblacion',
          'empresa.movil',
          'empresa.fax',
          'empresa.web',
          'empresa.nota',
          'empresa.sujeto_iva',
          'empresa.id_provincia',
          'empresa.fiscal_year_start_month',
          'empresa.fiscal_year_start_day'
        ])
        .where('empresa.id_empresa = :id', { id: id_empresa })
        .getOne();
      
      console.log('🔍 Consulta directa resultado:', empresaDirecta);
      
      const empresa = await this.empresaRepository.findOne({ 
        where: { id_empresa },
        relations: ['moneda', 'pais', 'provincia', 'identificacion', 'redes_sociales', 'horarios_apertura']
      });
      
      if (empresa) {
        console.log('✅ Empresa encontrada con relaciones:', {
          id_empresa: empresa.id_empresa,
          nombre: empresa.nombre,
          codigo_postal: empresa.codigo_postal,
          poblacion: empresa.poblacion,
          movil: empresa.movil,
          fax: empresa.fax,
          web: empresa.web,
          nota: empresa.nota,
          sujeto_iva: empresa.sujeto_iva,
          fiscal_year_start_month: empresa.fiscal_year_start_month,
          fiscal_year_start_day: empresa.fiscal_year_start_day
        });
      } else {
        console.log('❌ Empresa no encontrada');
      }
      
      return empresa;
    } catch (error) {
      console.error('❌ Error en query empresa:', error);
      throw error;
    }
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