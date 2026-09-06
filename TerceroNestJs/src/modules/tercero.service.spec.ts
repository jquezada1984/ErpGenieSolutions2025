import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TerceroService } from './tercero/tercero.service';
import { Tercero } from './tercero/entities/tercero.entity';

describe('TerceroService', () => {
  let service: TerceroService;
  const find = jest.fn();
  const findOne = jest.fn();
  const qb = {
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    qb.where.mockReturnThis();
    qb.andWhere.mockReturnThis();
    qb.orderBy.mockReturnThis();
    qb.take.mockReturnThis();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerceroService,
        {
          provide: getRepositoryToken(Tercero),
          useValue: {
            find,
            findOne,
            createQueryBuilder: jest.fn(() => qb),
          },
        },
      ],
    }).compile();
    service = module.get(TerceroService);
  });

  it('findAll sin id_empresa devuelve []', async () => {
    await expect(service.findAll()).resolves.toEqual([]);
    expect(find).not.toHaveBeenCalled();
  });

  it('findAll filtra por id_empresa', async () => {
    find.mockResolvedValue([{ id_tercero: 't1', id_empresa: 'emp-1' }]);
    const rows = await service.findAll('emp-1');
    expect(rows[0].id_empresa).toBe('emp-1');
    expect(find).toHaveBeenCalledWith({
      where: { id_empresa: 'emp-1' },
      relations: ['empresa', 'tipo_tercero'],
      order: { fecha_creacion: 'DESC' },
    });
  });

  it('findClientes filtra cliente=true e id_empresa', async () => {
    find.mockResolvedValue([]);
    await service.findClientes('emp-9');
    expect(find).toHaveBeenCalledWith({
      where: { cliente: true, id_empresa: 'emp-9' },
      relations: ['empresa', 'tipo_tercero'],
      order: { fecha_creacion: 'DESC' },
    });
  });

  it('findClientesPorBusqueda sin empresa no consulta', async () => {
    await expect(service.findClientesPorBusqueda('', 'ana', 10)).resolves.toEqual(
      [],
    );
    expect(qb.getMany).not.toHaveBeenCalled();
  });

  it('findClientesPorBusqueda aplica id_empresa en QB', async () => {
    qb.getMany.mockResolvedValue([{ id_tercero: 'c1' }]);
    await service.findClientesPorBusqueda('emp-1', 'ana', 40);
    expect(qb.andWhere).toHaveBeenCalledWith('t.id_empresa = :emp', {
      emp: 'emp-1',
    });
  });

  it('findOne lanza NotFoundException', async () => {
    findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
