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

  @Field(() => ID)
  id_perfil: string;
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

/** Diagnóstico de conexión a BD en login (sin credenciales). */
@ObjectType()
export class DbConnectionStatus {
  @Field()
  ok: boolean;

  @Field()
  latencyMs: number;

  @Field()
  databaseName: string;

  /** Host:puerto configurado (sin usuario ni contraseña). */
  @Field()
  hostHint: string;
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

  @Field(() => DbConnectionStatus)
  dbConnection: DbConnectionStatus;
} 