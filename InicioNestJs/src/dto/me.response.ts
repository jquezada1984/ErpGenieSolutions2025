import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Usuario } from '../entities/usuario.entity';

@ObjectType()
export class MeResponse {
  @Field(() => Usuario)
  user: Usuario;
}
