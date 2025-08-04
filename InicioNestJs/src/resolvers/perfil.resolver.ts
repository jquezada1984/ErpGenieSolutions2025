import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Perfil } from '../entities/perfil.entity';
import { PerfilListDto } from '../dto/perfil-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Perfil)
export class PerfilResolver {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
  ) {}

  @Query(() => [PerfilListDto])
  async perfiles(): Promise<PerfilListDto[]> {
    console.log('🔍 Query perfiles ejecutada');
    try {
      const perfiles = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .orderBy('perfil.nombre', 'ASC')
        .getMany();
      
      console.log(`✅ ${perfiles.length} perfiles encontrados`);
      return perfiles;
    } catch (error) {
      console.error('❌ Error en query perfiles:', error);
      throw error;
    }
  }

  @Query(() => Perfil, { nullable: true })
  async perfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<Perfil | null> {
    console.log('🔍 Query perfil ejecutada para ID:', id_perfil);
    try {
      const perfil = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('perfil.id_perfil = :id', { id: id_perfil })
        .getOne();
      
      if (perfil) {
        console.log('✅ Perfil encontrado:', {
          id_perfil: perfil.id_perfil,
          nombre: perfil.nombre,
          descripcion: perfil.descripcion,
          estado: perfil.estado,
          empresa: perfil.empresa ? {
            id_empresa: perfil.empresa.id_empresa,
            nombre: perfil.empresa.nombre
          } : null
        });
      } else {
        console.log('❌ Perfil no encontrado');
      }
      
      return perfil;
    } catch (error) {
      console.error('❌ Error en query perfil:', error);
      throw error;
    }
  }

  @Query(() => [PerfilListDto])
  async perfilesPorEmpresa(@Args('id_empresa', { type: () => ID }) id_empresa: string): Promise<PerfilListDto[]> {
    console.log('🔍 Query perfilesPorEmpresa ejecutada para empresa:', id_empresa);
    try {
      const perfiles = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('perfil.id_empresa = :id_empresa', { id_empresa })
        .andWhere('perfil.estado = :estado', { estado: true })
        .orderBy('perfil.nombre', 'ASC')
        .getMany();
      
      console.log(`✅ ${perfiles.length} perfiles encontrados para empresa ${id_empresa}`);
      return perfiles;
    } catch (error) {
      console.error('❌ Error en query perfilesPorEmpresa:', error);
      throw error;
    }
  }

  @Mutation(() => Perfil)
  async crearPerfil(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('nombre') nombre: string,
    @Args('descripcion', { nullable: true }) descripcion?: string,
  ): Promise<Perfil> {
    console.log('🔧 Creando perfil:', { id_empresa, nombre, descripcion });
    try {
      const perfil = this.perfilRepository.create({ 
        id_empresa, 
        nombre, 
        descripcion,
        estado: true 
      });
      
      const perfilGuardado = await this.perfilRepository.save(perfil);
      console.log('✅ Perfil creado exitosamente:', perfilGuardado.id_perfil);
      return perfilGuardado;
    } catch (error) {
      console.error('❌ Error creando perfil:', error);
      throw error;
    }
  }

  @Mutation(() => Perfil, { nullable: true })
  async actualizarPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('descripcion', { nullable: true }) descripcion?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
  ): Promise<Perfil | null> {
    console.log('🔧 Actualizando perfil:', { 
      id_perfil, 
      nombre, 
      descripcion, 
      estado 
    });
    
    try {
      const perfil = await this.perfilRepository.findOne({ where: { id_perfil } });
      if (!perfil) {
        console.log('❌ Perfil no encontrado para actualizar');
        throw new NotFoundException('Perfil no encontrado');
      }
      
      if (nombre !== undefined) perfil.nombre = nombre;
      if (descripcion !== undefined) perfil.descripcion = descripcion;
      if (estado !== undefined) perfil.estado = estado;
      
      const perfilActualizado = await this.perfilRepository.save(perfil);
      console.log('✅ Perfil actualizado exitosamente:', perfilActualizado.id_perfil);
      return perfilActualizado;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async eliminarPerfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<boolean> {
    console.log('🔧 Eliminando perfil:', id_perfil);
    try {
      const result = await this.perfilRepository.delete(id_perfil);
      const eliminado = (result.affected || 0) > 0;
      console.log(eliminado ? '✅ Perfil eliminado exitosamente' : '❌ Perfil no encontrado para eliminar');
      return eliminado;
    } catch (error) {
      console.error('❌ Error eliminando perfil:', error);
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async cambiarEstadoPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('estado') estado: boolean,
  ): Promise<boolean> {
    console.log('🔧 Cambiando estado de perfil:', { id_perfil, estado });
    try {
      const result = await this.perfilRepository
        .createQueryBuilder()
        .update(Perfil)
        .set({ estado })
        .where('id_perfil = :id', { id: id_perfil })
        .execute();
      
      const actualizado = (result.affected || 0) > 0;
      console.log(actualizado ? '✅ Estado de perfil actualizado' : '❌ Perfil no encontrado');
      return actualizado;
    } catch (error) {
      console.error('❌ Error cambiando estado de perfil:', error);
      throw error;
    }
  }
} 