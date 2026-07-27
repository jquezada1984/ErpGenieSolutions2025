import { CategoriaGastoService } from './categoria-gasto.service';

describe('CategoriaGastoService (multiempresa)', () => {
  const empA = 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  const empB = 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  const catId = 'cccccccc-cccc-cccc-cccc-cccccccccccc';

  let service: CategoriaGastoService;
  let qb: {
    where: jest.Mock;
    andWhere: jest.Mock;
    orderBy: jest.Mock;
    getMany: jest.Mock;
  };
  let repo: {
    createQueryBuilder: jest.Mock;
    findOne: jest.Mock;
  };

  beforeEach(() => {
    qb = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    repo = {
      createQueryBuilder: jest.fn().mockReturnValue(qb),
      findOne: jest.fn(),
    };
    service = new CategoriaGastoService(repo as any);
  });

  it('listado filtra por id_empresa', async () => {
    await service.findAll(empA, true);
    expect(qb.where).toHaveBeenCalledWith('c.id_empresa = :id_empresa', {
      id_empresa: empA,
    });
    expect(qb.andWhere).toHaveBeenCalledWith('c.estado = true');
  });

  it('C) categoria UUID empresa A con empresa B → null', async () => {
    repo.findOne.mockResolvedValue(null);
    const result = await service.findOne(catId, empB);
    expect(result).toBeNull();
    expect(repo.findOne).toHaveBeenCalledWith({
      where: { id_categoria_gasto: catId, id_empresa: empB },
    });
  });

  it('solo_activos=false no filtra estado', async () => {
    await service.findAll(empA, false);
    expect(qb.andWhere).not.toHaveBeenCalled();
  });
});
