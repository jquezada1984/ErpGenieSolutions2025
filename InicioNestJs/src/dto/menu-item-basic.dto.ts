import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType()
export class MenuItemBasicDto {
  @Field(() => ID)
  id_item: string;

  @Field()
  etiqueta: string;

  @Field()
  estado: boolean;

  @Field({ nullable: true })
  ruta?: string;

  @Field({ nullable: true })
  icono?: string;
}
