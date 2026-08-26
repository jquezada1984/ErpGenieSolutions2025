import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { FinancieroLecturaService } from '../services/financiero-lectura.service';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';
import { FacturasClientePaginadas } from '../dto/facturas-cliente-paginadas.dto';
import { Pago } from '../entities/pago.entity';
import { PagosPaginados } from '../dto/pagos-paginados.dto';

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

  @Query(() => FacturasClientePaginadas, { name: 'facturasCliente' })
  facturasCliente(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('estado', { type: () => String, nullable: true }) estado?: string,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
    @Args('id_tercero', { type: () => String, nullable: true }) id_tercero?: string,
    @Args('solo_pendientes', { type: () => Boolean, nullable: true, defaultValue: false })
    solo_pendientes?: boolean,
  ): Promise<FacturasClientePaginadas> {
    return this.lectura.listarFacturasCliente(
      id_empresa,
      page,
      limit,
      estado,
      busqueda,
      solo_pendientes,
      id_tercero,
    );
  }

  @Query(() => Factura, { name: 'facturaProveedor', nullable: true })
  facturaProveedor(
    @Args('id_factura', { type: () => String }) id_factura: string,
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<Factura | null> {
    return this.lectura.obtenerFacturaProveedor(id_factura, id_empresa);
  }

  @Query(() => FacturasClientePaginadas, { name: 'facturasProveedor' })
  facturasProveedor(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('estado', { type: () => String, nullable: true }) estado?: string,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
    @Args('id_tercero', { type: () => String, nullable: true }) id_tercero?: string,
    @Args('solo_pendientes', { type: () => Boolean, nullable: true, defaultValue: false })
    solo_pendientes?: boolean,
  ): Promise<FacturasClientePaginadas> {
    return this.lectura.listarFacturasProveedor(
      id_empresa,
      page,
      limit,
      estado,
      busqueda,
      solo_pendientes,
      id_tercero,
    );
  }

  @Query(() => PagosPaginados, { name: 'cobrosCliente' })
  cobrosCliente(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('estado', { type: () => String, nullable: true }) estado?: string,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
  ): Promise<PagosPaginados> {
    return this.lectura.listarPagos(id_empresa, 'COBRO', page, limit, estado, busqueda);
  }

  @Query(() => Pago, { name: 'cobroCliente', nullable: true })
  cobroCliente(
    @Args('id_pago', { type: () => String }) id_pago: string,
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<Pago | null> {
    return this.lectura.obtenerPago(id_pago, id_empresa, 'COBRO');
  }

  @Query(() => PagosPaginados, { name: 'pagosProveedor' })
  pagosProveedor(
    @Args('id_empresa', { type: () => String }) id_empresa: string,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page?: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 50 }) limit?: number,
    @Args('estado', { type: () => String, nullable: true }) estado?: string,
    @Args('busqueda', { type: () => String, nullable: true }) busqueda?: string,
  ): Promise<PagosPaginados> {
    return this.lectura.listarPagos(id_empresa, 'PAGO_PROVEEDOR', page, limit, estado, busqueda);
  }

  @Query(() => Pago, { name: 'pagoProveedor', nullable: true })
  pagoProveedor(
    @Args('id_pago', { type: () => String }) id_pago: string,
    @Args('id_empresa', { type: () => String }) id_empresa: string,
  ): Promise<Pago | null> {
    return this.lectura.obtenerPago(id_pago, id_empresa, 'PAGO_PROVEEDOR');
  }
}
