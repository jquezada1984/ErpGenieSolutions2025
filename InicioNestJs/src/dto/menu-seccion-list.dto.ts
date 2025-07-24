import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class MenuSeccionListDto {
  @Field()
  nombre: string;

  @Field(() => Int)
  orden: number;
} 