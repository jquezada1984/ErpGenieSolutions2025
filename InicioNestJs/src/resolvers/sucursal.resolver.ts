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
    return this.sucursalRepository.find({
      select: ['id_sucursal', 'nombre', 'direccion', 'telefono', 'estado']
    });
  }

  @Query(() => Sucursal, { nullable: true })
  async sucursal(@Args('id_sucursal', { type: () => ID }) id_sucursal: string): Promise<Sucursal | null> {
    return this.sucursalRepository.findOne({ where: { id_sucursal } });
  }

  @Mutation(() => Sucursal)
  async crearSucursal(
    @Args('id_empresa', { type: () => ID }) id_empresa: string,
    @Args('nombre') nombre: string,
    @Args('direccion', { nullable: true }) direccion?: string,
    @Args('telefono', { nullable: true }) telefono?: string,
  ): Promise<Sucursal> {
    const sucursal = this.sucursalRepository.create({ 
      id_empresa, 
      nombre, 
      direccion, 
      telefono,
      estado: true 
    });
    return this.sucursalRepository.save(sucursal);
  }

  @Mutation(() => Sucursal, { nullable: true })
  async actualizarSucursal(
    @Args('id_sucursal', { type: () => ID }) id_sucursal: string,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('direccion', { nullable: true }) direccion?: string,
    @Args('telefono', { nullable: true }) telefono?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
  ): Promise<Sucursal | null> {
    const sucursal = await this.sucursalRepository.findOne({ where: { id_sucursal } });
    if (!sucursal) throw new NotFoundException('Sucursal no encontrada');
    if (nombre !== undefined) sucursal.nombre = nombre;
    if (direccion !== undefined) sucursal.direccion = direccion;
    if (telefono !== undefined) sucursal.telefono = telefono;
    if (estado !== undefined) sucursal.estado = estado;
    return this.sucursalRepository.save(sucursal);
  }

  @Mutation(() => Boolean)
  async eliminarSucursal(@Args('id_sucursal', { type: () => ID }) id_sucursal: string): Promise<boolean> {
    const result = await this.sucursalRepository.delete(id_sucursal);
    return (result.affected || 0) > 0;
  }
} 