import { Resolver, Query } from '@nestjs/graphql';
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
  async formasPago(): Promise<FormaPago[]> {
    return this.formaPagoRepository.find({
      order: { descripcion: 'ASC' }
    });
  }

  @Query(() => [CondicionPago], { name: 'condicionesPago' })
  async condicionesPago(): Promise<CondicionPago[]> {
    return this.condicionPagoRepository.find({
      order: { descripcion: 'ASC' }
    });
  }
}
