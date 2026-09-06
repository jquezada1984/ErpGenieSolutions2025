import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemsService } from './items.service';
import { Item } from './entities/item.entity';

describe('ItemsService', () => {
  let service: ItemsService;
  const qb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    innerJoin: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };
  const update = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    Object.values(qb).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReturnThis' in fn) {
        (fn as jest.Mock).mockReturnThis();
      }
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsService,
        {
          provide: getRepositoryToken(Item),
          useValue: {
            createQueryBuilder: jest.fn(() => qb),
            update,
            manager: { query: jest.fn() },
          },
        },
      ],
    }).compile();
    service = module.get(ItemsService);
  });

  it('listado aplica filtro id_empresa', async () => {
    qb.getMany.mockResolvedValue([{ id_item: 'i1', id_empresa: 'emp-1' }]);
    const rows = await service.listado({ id_empresa: 'emp-1' });
    expect(rows).toHaveLength(1);
    expect(qb.andWhere).toHaveBeenCalledWith('item.id_empresa = :idEmp', {
      idEmp: 'emp-1',
    });
  });

  it('listado sin id_empresa no filtra empresa', async () => {
    qb.getMany.mockResolvedValue([]);
    await service.listado({});
    expect(qb.andWhere).not.toHaveBeenCalledWith(
      'item.id_empresa = :idEmp',
      expect.anything(),
    );
  });

  it('actualizarEstado usa update por id_item', async () => {
    update.mockResolvedValue({ affected: 1 });
    await expect(service.actualizarEstado('i1', false)).resolves.toBe(true);
    expect(update).toHaveBeenCalledWith({ id_item: 'i1' }, { estado: false });
  });
});
