import { ObjectType, Field, Float } from '@nestjs/graphql';

@ObjectType()
export class EstadoResultadosRow {
  @Field()
  tipo_cuenta: string;

  @Field(() => Float)
  total: number;

  @Field(() => Float, { nullable: true })
  resultado: number | null;
}
