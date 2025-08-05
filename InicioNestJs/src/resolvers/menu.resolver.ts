import { Resolver, Query, Mutation, Args, Int, ID } from '@nestjs/graphql';
import { MenuSeccion, MenuItem } from '../entities/menu.entity';
import { MenuSeccionListDto } from '../dto/menu-seccion-list.dto';
import { MenuItemListDto } from '../dto/menu-item-list.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => MenuSeccion)
export class MenuSeccionResolver {
  constructor(
    @InjectRepository(MenuSeccion)
    private menuSeccionRepository: Repository<MenuSeccion>,
  ) {}

  @Query(() => [MenuSeccion])
  async secciones(): Promise<MenuSeccion[]> {
    return this.menuSeccionRepository.find({
      order: { orden: 'ASC' }
    });
  }

  @Query(() => MenuSeccion, { nullable: true })
  async seccion(@Args('id_seccion', { type: () => ID }) id_seccion: string): Promise<MenuSeccion | null> {
    return this.menuSeccionRepository.findOne({ 
      where: { id_seccion },
      relations: ['items']
    });
  }

  @Mutation(() => MenuSeccion)
  async crearSeccion(
    @Args('nombre') nombre: string,
    @Args('orden', { type: () => Int, nullable: true }) orden?: number,
    @Args('icono', { nullable: true }) icono?: string,
  ): Promise<MenuSeccion> {
    const seccion = this.menuSeccionRepository.create({ 
      nombre, 
      orden: orden || 0,
      icono
    });
    return this.menuSeccionRepository.save(seccion);
  }

  @Mutation(() => MenuSeccion, { nullable: true })
  async actualizarSeccion(
    @Args('id_seccion', { type: () => ID }) id_seccion: string,
    @Args('nombre', { nullable: true }) nombre?: string,
    @Args('orden', { type: () => Int, nullable: true }) orden?: number,
    @Args('icono', { nullable: true }) icono?: string,
  ): Promise<MenuSeccion | null> {
    const seccion = await this.menuSeccionRepository.findOne({ where: { id_seccion } });
    if (!seccion) throw new NotFoundException('Sección no encontrada');
    if (nombre !== undefined) seccion.nombre = nombre;
    if (orden !== undefined) seccion.orden = orden;
    if (icono !== undefined) seccion.icono = icono;
    return this.menuSeccionRepository.save(seccion);
  }

  @Mutation(() => Boolean)
  async eliminarSeccion(@Args('id_seccion', { type: () => ID }) id_seccion: string): Promise<boolean> {
    const result = await this.menuSeccionRepository.delete(id_seccion);
    return (result.affected || 0) > 0;
  }
}

@Resolver(() => MenuItem)
export class MenuItemResolver {
  constructor(
    @InjectRepository(MenuItem)
    private menuItemRepository: Repository<MenuItem>,
  ) {}

  @Query(() => [MenuItem])
  async items(): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      relations: ['seccion'],
      order: { orden: 'ASC' }
    });
  }

  @Query(() => MenuItem, { nullable: true })
  async item(@Args('id_item', { type: () => ID }) id_item: string): Promise<MenuItem | null> {
    return this.menuItemRepository.findOne({ 
      where: { id_item },
      relations: ['seccion', 'parent', 'subitems']
    });
  }

  @Query(() => [MenuItem])
  async itemsPorSeccion(@Args('id_seccion', { type: () => ID }) id_seccion: string): Promise<MenuItem[]> {
    return this.menuItemRepository.find({
      where: { id_seccion, parent_id: undefined },
      relations: ['subitems'],
      order: { orden: 'ASC' }
    });
  }

  @Mutation(() => MenuItem)
  async crearItem(
    @Args('id_seccion', { type: () => ID }) id_seccion: string,
    @Args('etiqueta') etiqueta: string,
    @Args('icono', { nullable: true }) icono?: string,
    @Args('ruta', { nullable: true }) ruta?: string,
    @Args('es_clickable', { nullable: true }) es_clickable?: boolean,
    @Args('orden', { type: () => Int, nullable: true }) orden?: number,
    @Args('muestra_badge', { nullable: true }) muestra_badge?: boolean,
    @Args('badge_text', { nullable: true }) badge_text?: string,
    @Args('parent_id', { type: () => ID, nullable: true }) parent_id?: string,
    @Args('created_by', { type: () => ID, nullable: true }) created_by?: string,
  ): Promise<MenuItem> {
    const item = this.menuItemRepository.create({
      id_seccion,
      etiqueta,
      icono,
      ruta,
      es_clickable: es_clickable !== undefined ? es_clickable : true,
      orden: orden || 0,
      muestra_badge: muestra_badge || false,
      badge_text,
      parent_id,
      created_by,
      estado: true
    });
    return this.menuItemRepository.save(item);
  }

  @Mutation(() => MenuItem, { nullable: true })
  async actualizarItem(
    @Args('id_item', { type: () => ID }) id_item: string,
    @Args('etiqueta', { nullable: true }) etiqueta?: string,
    @Args('icono', { nullable: true }) icono?: string,
    @Args('ruta', { nullable: true }) ruta?: string,
    @Args('es_clickable', { nullable: true }) es_clickable?: boolean,
    @Args('orden', { type: () => Int, nullable: true }) orden?: number,
    @Args('muestra_badge', { nullable: true }) muestra_badge?: boolean,
    @Args('badge_text', { nullable: true }) badge_text?: string,
    @Args('estado', { nullable: true }) estado?: boolean,
    @Args('updated_by', { type: () => ID, nullable: true }) updated_by?: string,
  ): Promise<MenuItem | null> {
    const item = await this.menuItemRepository.findOne({ where: { id_item } });
    if (!item) throw new NotFoundException('Item no encontrado');
    
    if (etiqueta !== undefined) item.etiqueta = etiqueta;
    if (icono !== undefined) item.icono = icono;
    if (ruta !== undefined) item.ruta = ruta;
    if (es_clickable !== undefined) item.es_clickable = es_clickable;
    if (orden !== undefined) item.orden = orden;
    if (muestra_badge !== undefined) item.muestra_badge = muestra_badge;
    if (badge_text !== undefined) item.badge_text = badge_text;
    if (estado !== undefined) item.estado = estado;
    if (updated_by !== undefined) item.updated_by = updated_by;
    
    item.updated_at = new Date();
    return this.menuItemRepository.save(item);
  }

  @Mutation(() => Boolean)
  async eliminarItem(@Args('id_item', { type: () => ID }) id_item: string): Promise<boolean> {
    const result = await this.menuItemRepository.delete(id_item);
    return (result.affected || 0) > 0;
  }
} 