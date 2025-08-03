import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Sucursal } from '../entities/sucursal.entity';
import { SucursalListDto } from '../dto/sucursal-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Sucursal)
export class SucursalResolver {
  constructor(
    @InjectRepository(Sucursal)
    private sucursalRepository: Repository<Sucursal>,
  ) {}

  @Query(() => [SucursalListDto])
  async sucursales(): Promise<SucursalListDto[]> {
    console.log('🔍 Query sucursales ejecutada');
    try {
      const sucursales = await this.sucursalRepository
        .createQueryBuilder('sucursal')
        .leftJoinAndSelect('sucursal.empresa', 'empresa')
        .orderBy('sucursal.nombre', 'ASC')
        .getMany();
      
      console.log(`✅ ${sucursales.length} sucursales encontradas`);
      return sucursales;
    } catch (error) {
      console.error('❌ Error en query sucursales:', error);
      throw error;
    }
  }

  @Query(() => Sucursal, { nullable: true })
  async sucursal(@Args('id_sucursal', { type: () => ID }) id_sucursal: string): Promise<Sucursal | null> {
    console.log('🔍 Query sucursal ejecutada para ID:', id_sucursal);
    try {
      const sucursal = await this.sucursalRepository
        .createQueryBuilder('sucursal')
        .leftJoinAndSelect('sucursal.empresa', 'empresa')
        .where('sucursal.id_sucursal = :id', { id: id_sucursal })
        .getOne();
      
      if (sucursal) {
        console.log('✅ Sucursal encontrada:', {
          id_sucursal: sucursal.id_sucursal,
          nombre: sucursal.nombre,
          direccion: sucursal.direccion,
          telefono: sucursal.telefono,
          estado: sucursal.estado,
          codigo_establecimiento: sucursal.codigo_establecimiento,
          empresa: sucursal.empresa ? {
            id_empresa: sucursal.empresa.id_empresa,
            nombre: sucursal.empresa.nombre
          } : null
        });
      } else {
        console.log('❌ Sucursal no encontrada');
      }
      
      return sucursal;
    } catch (error) {
      console.error('❌ Error en query sucursal:', error);
      throw error;
    }
  }

  @Query(() => [SucursalListDto])
  async sucursalesPorEmpresa(@Args('id_empresa', { type: () => ID }) id_empresa: string): Promise<SucursalListDto[]> {
    console.log('🔍 Query sucursalesPorEmpresa ejecutada para empresa:', id_empresa);
    try {
      const sucursales = await this.sucursalRepository
        .createQueryBuilder('sucursal')
        .leftJoinAndSelect('sucursal.empresa', 'empresa')
        .where('sucursal.id_empresa = :id_empresa', { id_empresa })
        .andWhere('sucursal.estado = :estado', { estado: true })
        .orderBy('sucursal.nombre', 'ASC')
        .getMany();
      
      console.log(`✅ ${sucursales.length} sucursales encontradas para empresa ${id_empresa}`);
      return sucursales;
    } catch (error) {
      console.error('❌ Error en query sucursalesPorEmpresa:', error);
      throw error;
    }
  }

  @Mutation(() => Sucursal)
  async crearSucursal(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('nombre') nombre: string,
    @Args('direccion', { nullable: true }) direccion?: string,
    @Args('telefono', { nullable: true }) telefono?: string,
    @Args('codigo_establecimiento', { nullable: true }) codigo_establecimiento?: string,
  ): Promise<Sucursal> {
    console.log('🔧 Creando sucursal:', { id_empresa, nombre, direccion, telefono, codigo_establecimiento });
    try {
      const sucursal = this.sucursalRepository.create({ 
        id_empresa, 
        nombre, 
        direccion, 
        telefono,
        codigo_establecimiento: codigo_establecimiento || '001',
        estado: true 
      });
      
      const sucursalGuardada = await this.sucursalRepository.save(sucursal);
      console.log('✅ Sucursal creada exitosamente:', sucursalGuardada.id_sucursal);
      return sucursalGuardada;
    } catch (error) {
      console.error('❌ Error creando sucursal:', error);
      throw error;
    }
  }

  @Mutation(() => Sucursal, { nullable: true })
  async actualizarSucursal(
    @Args('id_sucursal', { type: () => ID }) id_sucursal: string,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('direccion', { nullable: true }) direccion?: string,
    @Args('telefono', { nullable: true }) telefono?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
    @Args('codigo_establecimiento', { nullable: true }) codigo_establecimiento?: string,
  ): Promise<Sucursal | null> {
    console.log('🔧 Actualizando sucursal:', { 
      id_sucursal, 
      nombre, 
      direccion, 
      telefono, 
      estado, 
      codigo_establecimiento 
    });
    
    try {
      const sucursal = await this.sucursalRepository.findOne({ where: { id_sucursal } });
      if (!sucursal) {
        console.log('❌ Sucursal no encontrada para actualizar');
        throw new NotFoundException('Sucursal no encontrada');
      }
      
      if (nombre !== undefined) sucursal.nombre = nombre;
      if (direccion !== undefined) sucursal.direccion = direccion;
      if (telefono !== undefined) sucursal.telefono = telefono;
      if (estado !== undefined) sucursal.estado = estado;
      if (codigo_establecimiento !== undefined) sucursal.codigo_establecimiento = codigo_establecimiento;
      
      const sucursalActualizada = await this.sucursalRepository.save(sucursal);
      console.log('✅ Sucursal actualizada exitosamente:', sucursalActualizada.id_sucursal);
      return sucursalActualizada;
    } catch (error) {
      console.error('❌ Error actualizando sucursal:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async eliminarSucursal(@Args('id_sucursal', { type: () => ID }) id_sucursal: string): Promise<boolean> {
    console.log('🔧 Eliminando sucursal:', id_sucursal);
    try {
      const result = await this.sucursalRepository.delete(id_sucursal);
      const eliminada = (result.affected || 0) > 0;
      console.log(eliminada ? '✅ Sucursal eliminada exitosamente' : '❌ Sucursal no encontrada para eliminar');
      return eliminada;
    } catch (error) {
      console.error('❌ Error eliminando sucursal:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async cambiarEstadoSucursal(
    @Args('id_sucursal', { type: () => ID }) id_sucursal: string,
    @Args('estado') estado: boolean,
  ): Promise<boolean> {
    console.log('🔧 Cambiando estado de sucursal:', { id_sucursal, estado });
    try {
      const result = await this.sucursalRepository
        .createQueryBuilder()
        .update(Sucursal)
        .set({ estado })
        .where('id_sucursal = :id', { id: id_sucursal })
        .execute();
      
      const actualizada = (result.affected || 0) > 0;
      console.log(actualizada ? '✅ Estado de sucursal actualizado' : '❌ Sucursal no encontrada');
      return actualizada;
    } catch (error) {
      console.error('❌ Error cambiando estado de sucursal:', error);
      throw error;
    }
  }
} 