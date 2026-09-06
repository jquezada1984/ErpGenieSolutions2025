import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { FinancieroLecturaService } from './financiero-lectura.service';
import { CondicionPagoCatalogo } from '../entities/condicion-pago-catalogo.entity';
import { FormaPagoCatalogo } from '../entities/forma-pago-catalogo.entity';
import { Moneda } from '../entities/moneda.entity';
import { Factura } from '../entities/factura.entity';
import { FacturaLinea } from '../entities/factura-linea.entity';
import { Pago } from '../entities/pago.entity';
import { PagoFactura } from '../entities/pago-factura.entity';

describe('FinancieroLecturaService', () => {
  let service: FinancieroLecturaService;
  const find = jest.fn();
  const formaQb = {
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    Object.values(formaQb).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReturnThis' in fn) {
        (fn as jest.Mock).mockReturnThis();
      }
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FinancieroLecturaService,
        {
          provide: getRepositoryToken(CondicionPagoCatalogo),
          useValue: { find },
        },
        {
          provide: getRepositoryToken(FormaPagoCatalogo),
          useValue: { createQueryBuilder: jest.fn(() => formaQb) },
        },
        { provide: getRepositoryToken(Moneda), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Factura), useValue: {} },
        { provide: getRepositoryToken(FacturaLinea), useValue: { find: jest.fn() } },
        { provide: getRepositoryToken(Pago), useValue: {} },
        { provide: getRepositoryToken(PagoFactura), useValue: {} },
        { provide: DataSource, useValue: { query: jest.fn() } },
      ],
    }).compile();
    service = module.get(FinancieroLecturaService);
  });

  it('listarCondicionesPago filtra por id_empresa', async () => {
    find.mockResolvedValue([]);
    await service.listarCondicionesPago(true, 'emp-1');
    expect(find).toHaveBeenCalledWith({
      where: { activo: true, id_empresa: 'emp-1' },
      order: { orden: 'ASC', codigo: 'ASC' },
    });
  });

  it('listarFormasPago aplica id_empresa en QB', async () => {
    formaQb.getMany.mockResolvedValue([]);
    await service.listarFormasPago(true, undefined, 'emp-2');
    expect(formaQb.andWhere).toHaveBeenCalledWith('f.id_empresa = :id_empresa', {
      id_empresa: 'emp-2',
    });
  });
});
