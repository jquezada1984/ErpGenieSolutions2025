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
    try {
      const perfiles = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .orderBy('perfil.nombre', 'ASC')
        .getMany();
      
      return perfiles;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => Perfil, { nullable: true })
  async perfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<Perfil | null> {
    try {
      const perfil = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('perfil.id_perfil = :id', { id: id_perfil })
        .getOne();
      
      return perfil;
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [PerfilListDto])
  async perfilesPorEmpresa(@Args('id_empresa', { type: () => ID }) id_empresa: string): Promise<PerfilListDto[]> {
    try {
      const perfiles = await this.perfilRepository
        .createQueryBuilder('perfil')
        .leftJoinAndSelect('perfil.empresa', 'empresa')
        .where('perfil.id_empresa = :id_empresa', { id_empresa })
        .andWhere('perfil.estado = :estado', { estado: true })
        .orderBy('perfil.nombre', 'ASC')
        .getMany();
      
      return perfiles;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Perfil)
  async crearPerfil(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('nombre') nombre: string,
    @Args('descripcion', { nullable: true }) descripcion?: string,
  ): Promise<Perfil> {
    try {
      const perfil = this.perfilRepository.create({ 
        id_empresa, 
        nombre, 
        descripcion,
        estado: true 
      });
      
      const perfilGuardado = await this.perfilRepository.save(perfil);
      return perfilGuardado;
    } catch (error) {
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
    try {
      const perfil = await this.perfilRepository.findOne({ where: { id_perfil } });
      if (!perfil) {
        throw new NotFoundException('Perfil no encontrado');
      }
      
      if (nombre !== undefined) perfil.nombre = nombre;
      if (descripcion !== undefined) perfil.descripcion = descripcion;
      if (estado !== undefined) perfil.estado = estado;
      
      const perfilActualizado = await this.perfilRepository.save(perfil);
      return perfilActualizado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async eliminarPerfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<boolean> {
    try {
      const result = await this.perfilRepository.delete(id_perfil);
      const eliminado = (result.affected || 0) > 0;
      return eliminado;
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => Boolean)
  async cambiarEstadoPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('estado') estado: boolean,
  ): Promise<boolean> {
    try {
      const result = await this.perfilRepository
        .createQueryBuilder()
        .update(Perfil)
        .set({ estado })
        .where('id_perfil = :id', { id: id_perfil })
        .execute();
      
      const actualizado = (result.affected || 0) > 0;
      return actualizado;
    } catch (error) {
      throw error;
    }
  }
} 