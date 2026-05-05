import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CuentaBancaria } from '../entities/cuenta-bancaria.entity';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';

@Injectable()
export class FinancieroLecturaService {
  constructor(
    @InjectRepository(CuentaBancaria)
    private readonly cuentaBancariaRepo: Repository<CuentaBancaria>,
    @InjectRepository(CondicionPagoCatalogo)
    private readonly condicionRepo: Repository<CondicionPagoCatalogo>,
    @InjectRepository(FormaPagoCatalogo)
    private readonly formaRepo: Repository<FormaPagoCatalogo>,
    @InjectRepository(Moneda)
    private readonly monedaRepo: Repository<Moneda>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  cuentasBancariasPorEmpresa(id_empresa: string): Promise<CuentaBancaria[]> {
    return this.cuentaBancariaRepo.find({
      where: { id_empresa },
      order: { etiqueta_cuenta: 'ASC', numero_cuenta: 'ASC' },
    });
  }

  listarCondicionesPago(): Promise<CondicionPagoCatalogo[]> {
    return this.condicionRepo.find({ order: { descripcion: 'ASC' } });
  }

  listarFormasPago(): Promise<FormaPagoCatalogo[]> {
    return this.formaRepo.find({ order: { descripcion: 'ASC' } });
  }

  listarMonedas(): Promise<Moneda[]> {
    return this.monedaRepo.find({ order: { nombre: 'ASC' } });
  }

  obtenerFacturaCliente(
    id_factura: string,
    id_empresa: string,
  ): Promise<Factura | null> {
    return this.facturaRepo.findOne({
      where: { id_factura, id_empresa },
    });
  }
}
