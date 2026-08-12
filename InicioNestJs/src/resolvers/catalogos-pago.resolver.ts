import { Args, Query, Resolver } from '@nestjs/graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FormaPago } from '../entities/forma-pago.entity';
import { CondicionPago } from '../entities/condicion-pago.entity';

@Resolver()
export class CatalogosPagoResolver {
  constructor(
    @InjectRepository(FormaPago)
    private readonly formaPagoRepository: Repository<FormaPago>,

    @InjectRepository(CondicionPago)
    private readonly condicionPagoRepository: Repository<CondicionPago>,
  ) {}

  @Query(() => [FormaPago], { name: 'formasPago' })
  async formasPago(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos?: boolean,
    @Args('tipoUso', { type: () => String, nullable: true })
    tipoUso?: string,
    @Args('id_empresa', { type: () => String, nullable: true })
    id_empresa?: string,
  ): Promise<FormaPago[]> {
    const qb = this.formaPagoRepository
      .createQueryBuilder('f')
      .orderBy('f.orden', 'ASC')
      .addOrderBy('f.codigo', 'ASC');
    if (soloActivos !== false) {
      qb.andWhere('f.activo = :activo', { activo: true });
    }
    if (tipoUso) {
      qb.andWhere('f.tipo_uso = :tipoUso', { tipoUso });
    }
    if (id_empresa) {
      qb.andWhere('f.id_empresa = :id_empresa', { id_empresa });
    }
    return qb.getMany();
  }

  @Query(() => [CondicionPago], { name: 'condicionesPago' })
  async condicionesPago(
    @Args('soloActivos', { type: () => Boolean, nullable: true, defaultValue: true })
    soloActivos?: boolean,
    @Args('id_empresa', { type: () => String, nullable: true })
    id_empresa?: string,
  ): Promise<CondicionPago[]> {
    const qb = this.condicionPagoRepository
      .createQueryBuilder('c')
      .orderBy('c.orden', 'ASC')
      .addOrderBy('c.codigo', 'ASC');
    if (soloActivos !== false) {
      qb.andWhere('c.activo = :activo', { activo: true });
    }
    if (id_empresa) {
      qb.andWhere('c.id_empresa = :id_empresa', { id_empresa });
    }
    return qb.getMany();
  }
}
