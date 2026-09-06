import { Resolver, Query, Args, Int, Context, ID, ResolveField, Parent } from '@nestjs/graphql';
import { Empresa } from '../entities/empresa.entity';
import { EmpresaListDto } from '../dto/empresa-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { EmpresaIdentificacion } from '../entities/empresa-identificacion.entity';

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
          'empresa.fiscal_year_start_day',
          'empresa.decimales_precio',
          'empresa.decimales_cantidad',
          'empresa.decimales_total',
          'empresa.pdf_mostrar_ruc',
          'empresa.pdf_pie_texto',
          'empresa.id_formato_papel',
        ])
        .where('empresa.id_empresa = :id', { id: id_empresa })
        .getOne();
      
      console.log('🔍 Consulta directa resultado:', empresaDirecta);
      
      const empresa = await this.empresaRepository
        .createQueryBuilder('empresa')
        .leftJoinAndSelect('empresa.moneda', 'moneda')
        .leftJoinAndSelect('empresa.pais', 'pais')
        .leftJoinAndSelect('empresa.provincia', 'provincia')
        .leftJoinAndSelect('empresa.identificacion', 'identificacion')
        .leftJoinAndSelect('empresa.redes_sociales', 'redes_sociales')
        .leftJoinAndSelect('redes_sociales.red_social', 'red_social')
        .leftJoinAndSelect('empresa.horarios_apertura', 'horarios_apertura')
        .where('empresa.id_empresa = :id', { id: id_empresa })
        .getOne();
      
      // Si la identificación no se cargó automáticamente, cargarla manualmente
      if (empresa && !empresa.identificacion) {
        console.log('🔧 Cargando identificación manualmente...');
        const identificacion = await this.empresaRepository.manager.query(
          'SELECT * FROM empresa_identificacion WHERE id_empresa = $1',
          [id_empresa]
        );
        if (identificacion && identificacion.length > 0) {
          empresa.identificacion = identificacion[0] as any;
          console.log('✅ Identificación cargada manualmente:', identificacion[0]);
        }
      }
      
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
        
        // Logging específico para redes sociales
        if (empresa.redes_sociales) {
          console.log('🔗 Redes sociales encontradas:', empresa.redes_sociales.length);
          empresa.redes_sociales.forEach((red, index) => {
            console.log(`  - Red ${index + 1}:`, {
              id: red.id,
              id_red_social: red.id_red_social,
              identificador: red.identificador,
              url: red.url,
              es_principal: red.es_principal,
              red_social: red.red_social ? {
                id_red_social: red.red_social.id_red_social,
                nombre: red.red_social.nombre,
                icono: red.red_social.icono
              } : null
            });
          });
        } else {
          console.log('🔗 No se encontraron redes sociales');
        }
        
        // Logging específico para identificación
        if (empresa.identificacion) {
          console.log('📊 Identificación encontrada:', {
            id_identificacion: empresa.identificacion.id_identificacion,
            administradores: empresa.identificacion.administradores,
            delegado_datos: empresa.identificacion.delegado_datos,
            capital: empresa.identificacion.capital,
            id_tipo_entidad: empresa.identificacion.id_tipo_entidad,
            objeto_empresa: empresa.identificacion.objeto_empresa,
            cif_intra: empresa.identificacion.cif_intra,
            id_profesional1: empresa.identificacion.id_profesional1,
            id_profesional2: empresa.identificacion.id_profesional2,
            id_profesional3: empresa.identificacion.id_profesional3,
            id_profesional4: empresa.identificacion.id_profesional4,
            id_profesional5: empresa.identificacion.id_profesional5,
            id_profesional6: empresa.identificacion.id_profesional6,
            id_profesional7: empresa.identificacion.id_profesional7,
            id_profesional8: empresa.identificacion.id_profesional8,
            id_profesional9: empresa.identificacion.id_profesional9,
            id_profesional10: empresa.identificacion.id_profesional10
          });
        } else {
          console.log('📊 No se encontró identificación');
        }
      } else {
        console.log('❌ Empresa no encontrada');
      }
      
      return empresa;
    } catch (error) {
      console.error('❌ Error en query empresa:', error);
      throw error;
    }
  }

  @ResolveField(() => EmpresaIdentificacion, { nullable: true })
  async identificacion(@Parent() empresa: Empresa): Promise<EmpresaIdentificacion | null> {
    console.log('🔧 Resolviendo identificación para empresa:', empresa.id_empresa);
    console.log('🔧 Empresa recibida en resolver:', {
      id_empresa: empresa.id_empresa,
      nombre: empresa.nombre,
      identificacion: empresa.identificacion
    });
    
    // Si ya está cargada, devolverla
    if (empresa.identificacion) {
      console.log('✅ Identificación ya cargada:', empresa.identificacion);
      return empresa.identificacion;
    }
    
    // Si no está cargada, cargarla manualmente
    console.log('🔧 Identificación no cargada, cargando manualmente...');
    const identificacion = await this.empresaRepository.manager.query(
      'SELECT * FROM empresa_identificacion WHERE id_empresa = $1',
      [empresa.id_empresa]
    );
    
    if (identificacion && identificacion.length > 0) {
      const identificacionData = identificacion[0];
      console.log('✅ Identificación cargada manualmente:', identificacionData);
      
      // Crear un objeto EmpresaIdentificacion con los datos
      const empresaIdentificacion = {
        id_identificacion: identificacionData.id_identificacion,
        id_empresa: identificacionData.id_empresa,
        administradores: identificacionData.administradores,
        delegado_datos: identificacionData.delegado_datos,
        capital: identificacionData.capital ? parseFloat(identificacionData.capital) : null,
        id_tipo_entidad: identificacionData.id_tipo_entidad,
        objeto_empresa: identificacionData.objeto_empresa,
        cif_intra: identificacionData.cif_intra,
        id_profesional1: identificacionData.id_profesional1,
        id_profesional2: identificacionData.id_profesional2,
        id_profesional3: identificacionData.id_profesional3,
        id_profesional4: identificacionData.id_profesional4,
        id_profesional5: identificacionData.id_profesional5,
        id_profesional6: identificacionData.id_profesional6,
        id_profesional7: identificacionData.id_profesional7,
        id_profesional8: identificacionData.id_profesional8,
        id_profesional9: identificacionData.id_profesional9,
        id_profesional10: identificacionData.id_profesional10,
        created_by: identificacionData.created_by,
        created_at: identificacionData.created_at,
        updated_by: identificacionData.updated_by,
        updated_at: identificacionData.updated_at
      };
      
      console.log('✅ Objeto de identificación creado:', empresaIdentificacion);
      return empresaIdentificacion as any;
    }
    
    console.log('❌ No se encontró identificación');
    return null;
  }

  // Nuevo: Query para refrescar el token
  @Query(() => String)
  async refreshToken(@Context() context): Promise<string> {
    // Aquí deberías obtener el usuario autenticado desde el contexto
    // Por simplicidad, asumimos que el usuario está en context.req.user
    const user = context.req.user;
    if (!user) throw new NotFoundException('Usuario no autenticado');
    // Generar un nuevo token usando el AuthService
    const result = await this.authService.login(user.email, user.password_hash);
    return result.accessToken;
  }

  // Mutaciones deshabilitadas por arquitectura:
  // @Mutation(() => Empresa)
  // async crearEmpresa(...) { ... }
  // @Mutation(() => Empresa, { nullable: true })
  // async actualizarEmpresa(...) { ... }
  // @Mutation(() => Boolean)
  // async eliminarEmpresa(...) { ... }
} 