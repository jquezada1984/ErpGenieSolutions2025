import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MenuItemListDto {
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
} 