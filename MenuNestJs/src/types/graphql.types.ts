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
