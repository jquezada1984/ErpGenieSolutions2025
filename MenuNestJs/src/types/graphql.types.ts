import { ObjectType, Field, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class SeccionMenu {
  @Field(() => ID)
  id_seccion: string;

  @Field()
  nombre: string;

  @Field(() => Int)
  orden: number;
}

@ObjectType()
export class PermisoMenu {
  @Field(() => ID)
  id_item: string;

  @Field()
  etiqueta: string;

  @Field({ nullable: true })
  ruta?: string;

  @Field({ nullable: true })
  icono?: string;

  @Field()
  permitido: boolean;

  @Field(() => SeccionMenu)
  seccion: SeccionMenu;
}

@ObjectType()
export class SeccionConPermisos {
  @Field(() => ID)
  id_seccion: string;

  @Field()
  nombre: string;

  @Field(() => Int)
  orden: number;

  @Field({ nullable: true })
  icono?: string;

  @Field(() => [PermisoMenu])
  items: PermisoMenu[];

  @Field()
  tienePermisos: boolean;
}

@ObjectType()
export class PerfilConPermisos {
  @Field(() => ID)
  id_perfil: string;

  @Field()
  nombre: string;

  @Field()
  estado: boolean;

  @Field(() => [SeccionConPermisos])
  secciones: SeccionConPermisos[];

  @Field(() => Int)
  totalPermisos: number;

  @Field(() => Int)
  permisosActivos: number;
}

@ObjectType()
export class EstadisticasPermisos {
  @Field(() => Int)
  totalSecciones: number;

  @Field(() => Int)
  totalItems: number;

  @Field(() => Int)
  itemsConPermisos: number;

  @Field(() => Int)
  porcentajeCobertura: number;
}

// Nuevos tipos para el menú ordenado jerárquico
@ObjectType()
export class MenuItemOrdenado {
  @Field(() => ID)
  id_item: string;

  @Field(() => ID)
  id_seccion: string;

  @Field(() => ID, { nullable: true })
  parent_id?: string;

  @Field()
  etiqueta: string;

  @Field({ nullable: true })
  icono?: string;

  @Field({ nullable: true })
  ruta?: string;

  @Field()
  es_clickable: boolean;

  @Field(() => Int)
  orden: number;

  @Field()
  muestra_badge: boolean;

  @Field({ nullable: true })
  badge_text?: string;

  @Field()
  estado: boolean;

  @Field({ nullable: true })
  created_by?: string;

  @Field({ nullable: true })
  created_at?: string;

  @Field({ nullable: true })
  updated_by?: string;

  @Field({ nullable: true })
  updated_at?: string;

  @Field(() => [MenuItemOrdenado], { nullable: true })
  children?: MenuItemOrdenado[];
}

@ObjectType()
export class MenuLateralOrdenado {
  @Field(() => ID)
  id_seccion: string;

  @Field()
  nombre: string;

  @Field(() => Int)
  orden: number;

  @Field({ nullable: true })
  icono?: string;

  @Field(() => [MenuItemOrdenado])
  items: MenuItemOrdenado[];
}
