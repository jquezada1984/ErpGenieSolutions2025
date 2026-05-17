import { Resolver, Query, Args } from '@nestjs/graphql';
import { FinancieroLecturaService } from '../services/financiero-lectura.service';
import { CuentaBancaria } from '../entities/cuenta-bancaria.entity';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';

@Resolver()
export class FinancieroResolver {
  constructor(private readonly lectura: FinancieroLecturaService) {}

  @Query(() => [CuentaBancaria], { name: 'cuentasBancarias' })
  cuentasBancarias(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<CuentaBancaria[]> {
    return this.lectura.cuentasBancariasPorEmpresa(id_empresa);
  }

  @Query(() => [CondicionPagoCatalogo], { name: 'condicionesPagoFin' })
  condicionesPagoFin(): Promise<CondicionPagoCatalogo[]> {
    return this.lectura.listarCondicionesPago();
  }

  @Query(() => [FormaPagoCatalogo], { name: 'formasPagoFin' })
  formasPagoFin(
    @Args('tipoUso', { type: () => String, nullable: true }) tipoUso?: string,
  ): Promise<FormaPagoCatalogo[]> {
    return this.lectura.listarFormasPago(true, tipoUso);
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
