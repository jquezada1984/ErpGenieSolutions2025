import { Resolver, Query, Args } from '@nestjs/graphql';
import { FinancieroLecturaService } from '../services/financiero-lectura.service';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';

@Resolver()
export class FinancieroResolver {
  constructor(private readonly lectura: FinancieroLecturaService) {}

  @Query(() => [CondicionPagoCatalogo], { name: 'condicionesPagoFin' })
  condicionesPagoFin(
    @Args('id_empresa', { type: () => String, nullable: true }) id_empresa?: string,
  ): Promise<CondicionPagoCatalogo[]> {
    return this.lectura.listarCondicionesPago(true, id_empresa);
  }

  @Query(() => [FormaPagoCatalogo], { name: 'formasPagoFin' })
  formasPagoFin(
    @Args('tipoUso', { type: () => String, nullable: true }) tipoUso?: string,
    @Args('id_empresa', { type: () => String, nullable: true }) id_empresa?: string,
  ): Promise<FormaPagoCatalogo[]> {
    return this.lectura.listarFormasPago(true, tipoUso, id_empresa);
  }

  @Query(() => [Moneda], { name: 'monedasFin' })
  monedasFin(): Promise<Moneda[]> {
    return this.lectura.listarMonedas();
  }

  @Query(() => Factura, { name: 'facturaCliente', nullable: true })
  facturaCliente(
    @Args('id_factura', { type: () => String }) id_factura: string,
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<Factura | null> {
    return this.lectura.obtenerFacturaCliente(id_factura, id_empresa);
  }
}
