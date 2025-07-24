import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { Perfil } from '../entities/perfil.entity';
import { PerfilListDto } from '../dto/perfil-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { CreatePerfilInput } from '../dto/create-perfil.input';
import { UpdatePerfilInput } from '../dto/update-perfil.input';

@Resolver(() => Perfil)
export class PerfilResolver {
  constructor(
    @InjectRepository(Perfil)
    private perfilRepository: Repository<Perfil>,
  ) {}

  @Query(() => [PerfilListDto])
  async perfiles(): Promise<PerfilListDto[]> {
    return this.perfilRepository.find({
      select: ['id_perfil', 'nombre', 'descripcion', 'estado']
    });
  }

  @Query(() => Perfil, { nullable: true })
  async perfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<Perfil | null> {
    return this.perfilRepository.findOne({ where: { id_perfil } });
  }

  @Mutation(() => Perfil)
  async crearPerfil(
    @Args('input') input: CreatePerfilInput,
  ): Promise<Perfil> {
    const perfil = this.perfilRepository.create(input);
    return this.perfilRepository.save(perfil);
  }

  @Mutation(() => Perfil, { nullable: true })
  async actualizarPerfil(
    @Args('id_perfil', { type: () => ID }) id_perfil: string,
    @Args('input') input: UpdatePerfilInput,
  ): Promise<Perfil | null> {
    const perfil = await this.perfilRepository.findOne({ where: { id_perfil } });
    if (!perfil) throw new NotFoundException('Perfil no encontrado');
    Object.assign(perfil, input);
    return this.perfilRepository.save(perfil);
  }

  @Mutation(() => Boolean)
  async eliminarPerfil(@Args('id_perfil', { type: () => ID }) id_perfil: string): Promise<boolean> {
    const result = await this.perfilRepository.delete(id_perfil);
    return (result.affected || 0) > 0;
  }
} 