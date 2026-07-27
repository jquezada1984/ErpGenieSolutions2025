import { GastoService } from './gasto.service';

describe('GastoService (multiempresa / lectura)', () => {
  const empA = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const empB = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const gastoId = '11111111-1111-1111-1111-111111111111';

  let service: GastoService;
  let qb: {
    where: jest.Mock;
    andWhere: jest.Mock;
    leftJoinAndSelect: jest.Mock;
    orderBy: jest.Mock;
    addOrderBy: jest.Mock;
    getMany: jest.Mock;
    getOne: jest.Mock;
  };
  let repo: { createQueryBuilder: jest.Mock };

  beforeEach(() => {
    qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      leftJoinAndSelect: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
      getOne: jest.fn().mockResolvedValue(null),
    };
    repo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
    };
    service = new GastoService(repo as any);
  });

  it('A) findAll siempre filtra por id_empresa (nunca lista sin empresa)', async () => {
    await service.findAll(empA);
    expect(qb.where).toHaveBeenCalledWith('g.id_empresa = :id_empresa', {
      id_empresa: empA,
    });
    expect(qb.getMany).toHaveBeenCalled();
  });

  it('F) filtros opcionales no eliminan WHERE id_empresa', async () => {
    await service.findAll(empA, {
      estado_gasto: 'BORRADOR',
      fecha_desde: '2026-01-01',
      fecha_hasta: '2026-12-31',
      id_categoria_gasto: 'cat',
      id_tercero: 'ter',
    });
    expect(qb.where).toHaveBeenCalledWith('g.id_empresa = :id_empresa', {
      id_empresa: empA,
    });
    expect(qb.andWhere).toHaveBeenCalledWith(
      'g.estado_gasto = :estado_gasto',
      expect.any(Object),
    );
    expect(qb.andWhere).toHaveBeenCalledWith(
      'g.fecha_gasto >= :fecha_desde',
      expect.any(Object),
    );
    expect(qb.andWhere).toHaveBeenCalledWith(
      'g.fecha_gasto <= :fecha_hasta',
      expect.any(Object),
    );
  });

  it('B) findOne UUID empresa A con empresa B → null (NOT FOUND)', async () => {
    qb.getOne.mockResolvedValue(null);
    const result = await service.findOne(gastoId, empB);
    expect(result).toBeNull();
    expect(qb.where).toHaveBeenCalledWith('g.id_gasto = :id_gasto', {
      id_gasto: gastoId,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('g.id_empresa = :id_empresa', {
      id_empresa: empB,
    });
  });

  it('D) findOne carga detalles solo con gasto autorizado (join + filtro empresa)', async () => {
    const fake = {
      id_gasto: gastoId,
      id_empresa: empA,
      detalles: [{ orden: 2 }, { orden: 1 }],
    };
    qb.getOne.mockResolvedValue(fake);
    const result = await service.findOne(gastoId, empA);
    expect(result).toBe(fake);
    expect(qb.leftJoinAndSelect).toHaveBeenCalledWith('g.detalles', 'd');
    expect(qb.andWhere).toHaveBeenCalledWith('g.id_empresa = :id_empresa', {
      id_empresa: empA,
    });
  });

  it('E) orden detalles: orden ASC, created_at ASC', async () => {
    await service.findOne(gastoId, empA);
    expect(qb.orderBy).toHaveBeenCalledWith('d.orden', 'ASC');
    expect(qb.addOrderBy).toHaveBeenCalledWith('d.created_at', 'ASC');
  });
});
