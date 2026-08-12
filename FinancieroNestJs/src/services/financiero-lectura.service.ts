import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';

@Injectable()
export class FinancieroLecturaService {
  constructor(
    @InjectRepository(CondicionPagoCatalogo)
    private readonly condicionRepo: Repository<CondicionPagoCatalogo>,
    @InjectRepository(FormaPagoCatalogo)
    private readonly formaRepo: Repository<FormaPagoCatalogo>,
    @InjectRepository(Moneda)
    private readonly monedaRepo: Repository<Moneda>,
    @InjectRepository(Factura)
    private readonly facturaRepo: Repository<Factura>,
  ) {}

  listarCondicionesPago(soloActivos = true, id_empresa?: string): Promise<CondicionPagoCatalogo[]> {
    const where: Record<string, unknown> = {};
    if (soloActivos) where.activo = true;
    if (id_empresa) where.id_empresa = id_empresa;
    return this.condicionRepo.find({
      where,
      order: { orden: 'ASC', codigo: 'ASC' },
    });
  }

  listarFormasPago(soloActivos = true, tipoUso?: string, id_empresa?: string): Promise<FormaPagoCatalogo[]> {
    const qb = this.formaRepo
      .createQueryBuilder('f')
      .orderBy('f.orden', 'ASC')
      .addOrderBy('f.codigo', 'ASC');
    if (soloActivos) {
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

  listarMonedas(soloActivos = true): Promise<Moneda[]> {
    return this.monedaRepo.find({
      where: soloActivos ? { activo: true } : {},
      order: { codigo: 'ASC' },
    });
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
