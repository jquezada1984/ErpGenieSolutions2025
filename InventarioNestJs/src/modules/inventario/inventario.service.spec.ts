import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { InventarioService } from './inventario.service';
import { Inventario } from './entities/inventario.entity';
import { AlmacenEntity } from './entities/almacen.entity';
import { StockItemAlmacen } from './entities/stock-item-almacen.entity';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { TransferenciaStock } from './entities/transferencia-stock.entity';
import { CambioMasivoStock } from './entities/cambio-masivo-stock.entity';
import { InventarioDetalleLinea } from './entities/inventario-detalle-linea.entity';
import { ItemLoteSerie } from './entities/item-lote-serie.entity';

function mockQb() {
  return {
    leftJoin: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
    addSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
    getRawMany: jest.fn(),
  };
}

describe('InventarioService', () => {
  let service: InventarioService;
  const invQb = mockQb();
  const almQb = mockQb();

  beforeEach(async () => {
    jest.clearAllMocks();
    Object.values(invQb).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReturnThis' in fn) (fn as jest.Mock).mockReturnThis();
    });
    Object.values(almQb).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReturnThis' in fn) (fn as jest.Mock).mockReturnThis();
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventarioService,
        {
          provide: getRepositoryToken(Inventario),
          useValue: { createQueryBuilder: jest.fn(() => invQb) },
        },
        {
          provide: getRepositoryToken(AlmacenEntity),
          useValue: { createQueryBuilder: jest.fn(() => almQb) },
        },
        { provide: getRepositoryToken(StockItemAlmacen), useValue: {} },
        { provide: getRepositoryToken(MovimientoInventario), useValue: {} },
        { provide: getRepositoryToken(TransferenciaStock), useValue: {} },
        { provide: getRepositoryToken(CambioMasivoStock), useValue: {} },
        { provide: getRepositoryToken(InventarioDetalleLinea), useValue: {} },
        { provide: getRepositoryToken(ItemLoteSerie), useValue: {} },
      ],
    }).compile();
    service = module.get(InventarioService);
  });

  it('inventariosListado filtra por id_empresa', async () => {
    invQb.getRawMany.mockResolvedValue([
      {
        id_inventario: 'inv1',
        id_empresa: 'emp-1',
        inventario_ref: 'R1',
        etiqueta: 'E',
        id_almacen: null,
        almacen: '',
        observacion: null,
        estado_inventario: 'ABIERTO',
        estado: true,
        product: 0,
      },
    ]);
    const rows = await service.inventariosListado({ id_empresa: 'emp-1' });
    expect(rows[0].id_empresa).toBe('emp-1');
    expect(invQb.andWhere).toHaveBeenCalledWith('inv.id_empresa = :idEmp', {
      idEmp: 'emp-1',
    });
  });

  it('almacenesPorEmpresa filtra empresa y activos', async () => {
    almQb.getMany.mockResolvedValue([
      {
        id_almacen: 'a1',
        id_empresa: 'emp-2',
        almacen_ref: 'A',
        nombre: 'Norte',
        estado: true,
      },
    ]);
    const rows = await service.almacenesPorEmpresa('emp-2', true);
    expect(rows[0].nombre).toBe('Norte');
    expect(almQb.andWhere).toHaveBeenCalledWith('a.id_empresa = :idEmp', {
      idEmp: 'emp-2',
    });
    expect(almQb.andWhere).toHaveBeenCalledWith('a.estado = true');
  });
});
