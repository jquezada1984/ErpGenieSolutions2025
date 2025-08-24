import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { PerfilBasicDto } from './perfil-basic.dto';
import { MenuItemBasicDto } from './menu-item-basic.dto';

@ObjectType()
export class PerfilMenuPermisoDto {
  @Field(() => ID)
  id_perfil: string;

  @Field(() => ID)
  id_item: string;

  @Field()
  permitido: boolean;

  @Field(() => PerfilBasicDto, { nullable: true })
  perfil?: PerfilBasicDto;

  @Field(() => MenuItemBasicDto, { nullable: true })
  menuItem?: MenuItemBasicDto;
}

@ObjectType()
export class PerfilMenuPermisoListDto {
  @Field(() => ID)
  id_perfil: string;

  @Field(() => ID)
  id_item: string;

  @Field()
  permitido: boolean;

  @Field()
  nombrePerfil: string;

  @Field()
  etiquetaMenuItem: string;

  @Field({ nullable: true })
  nombreSeccion?: string;
}

@ObjectType()
export class PermisosPorPerfilDto {
  @Field(() => ID)
  id_perfil: string;

  @Field()
  nombrePerfil: string;

  @Field(() => [PerfilMenuPermisoDto])
  permisos: PerfilMenuPermisoDto[];

  @Field(() => Int)
  totalPermisos: number;

  @Field(() => Int)
  permisosActivos: number;
}

@ObjectType()
export class PermisosPorMenuItemDto {
  @Field(() => ID)
  id_item: string;

  @Field()
  etiquetaMenuItem: string;

  @Field(() => [PerfilMenuPermisoDto])
  permisos: PerfilMenuPermisoDto[];

  @Field(() => Int)
  totalPerfiles: number;

  @Field(() => Int)
  perfilesConPermiso: number;
}
