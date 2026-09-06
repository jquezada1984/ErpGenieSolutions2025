import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Impuesto } from '../entities/impuesto.entity';
import { ImpuestoService } from './impuesto.service';

describe('ImpuestoService', () => {
  let service: ImpuestoService;
  const find = jest.fn();

  beforeEach(async () => {
    find.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImpuestoService,
        {
          provide: getRepositoryToken(Impuesto),
          useValue: { find },
        },
      ],
    }).compile();
    service = module.get(ImpuestoService);
  });

  it('findAll filtra por id_empresa', async () => {
    find.mockResolvedValue([{ id: 1, id_empresa: 'emp-1', codigo: 'IVA19' }]);
    const rows = await service.findAll({ id_empresa: 'emp-1' });
    expect(rows).toHaveLength(1);
    expect(find).toHaveBeenCalledWith({
      where: { id_empresa: 'emp-1' },
      order: { tasa: 'ASC', codigo: 'ASC' },
    });
  });

  it('findAll con solo_activos añade activo=true', async () => {
    find.mockResolvedValue([]);
    await service.findAll({ id_empresa: 'emp-2', solo_activos: true });
    expect(find).toHaveBeenCalledWith({
      where: { id_empresa: 'emp-2', activo: true },
      order: { tasa: 'ASC', codigo: 'ASC' },
    });
  });

  it('findAll sin filtros no mete where de empresa', async () => {
    find.mockResolvedValue([]);
    await service.findAll();
    expect(find).toHaveBeenCalledWith({
      where: {},
      order: { tasa: 'ASC', codigo: 'ASC' },
    });
  });
});
