import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class UsuarioResponse {
  @Field(() => ID)
  id: string;

  @Field()
  email: string;

  @Field()
  firstName: string;

  @Field()
  lastName: string;

  @Field()
  estado: boolean;
}

@ObjectType()
export class PerfilResponse {
  @Field(() => ID)
  id_perfil: string;

  @Field()
  nombre: string;

  @Field()
  estado: boolean;
}

@ObjectType()
export class PermisosResponse {
  @Field(() => [String])
  opcionesMenuSuperior: string[];

  @Field(() => [String])
  modulosDisponibles: string[];

  @Field()
  totalPermisos: number;
}

@ObjectType()
export class LoginResponse {
  @Field()
  accessToken: string;

  @Field(() => UsuarioResponse)
  user: UsuarioResponse;

  @Field(() => PerfilResponse)
  perfil: PerfilResponse;

  @Field(() => PermisosResponse)
  permisos: PermisosResponse;
} 