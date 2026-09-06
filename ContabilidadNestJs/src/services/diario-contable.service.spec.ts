import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DiarioContableService } from './diario-contable.service';
import { DiarioContable } from '../entities/diario-contable.entity';

describe('DiarioContableService', () => {
  let service: DiarioContableService;
  const find = jest.fn();
  const findOne = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiarioContableService,
        {
          provide: getRepositoryToken(DiarioContable),
          useValue: { find, findOne },
        },
      ],
    }).compile();
    service = module.get(DiarioContableService);
  });

  it('findByEmpresa filtra por id_empresa y enriquece labels', async () => {
    find.mockResolvedValue([
      {
        id_diario_contable: 'd1',
        id_empresa: 'emp-1',
        codigo: 'VE',
        nombre: 'Ventas',
        tipo_diario: 'VENTAS',
      },
    ]);
    const rows = await service.findByEmpresa('emp-1');
    expect(find).toHaveBeenCalledWith({
      where: { id_empresa: 'emp-1' },
      order: { codigo: 'ASC' },
    });
    expect(rows[0].etiqueta).toBe('Ventas');
    expect(rows[0].tipo_diario_label).toBe('Ventas');
  });

  it('findOne null si no existe', async () => {
    findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).resolves.toBeNull();
  });
});
