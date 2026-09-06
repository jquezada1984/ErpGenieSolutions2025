import { Test, TestingModule } from '@nestjs/testing';
import { ImpuestoResolver } from './impuesto.resolver';
import { ImpuestoService } from '../services/impuesto.service';

describe('ImpuestoResolver', () => {
  let resolver: ImpuestoResolver;
  const findAll = jest.fn();

  beforeEach(async () => {
    findAll.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ImpuestoResolver,
        { provide: ImpuestoService, useValue: { findAll } },
      ],
    }).compile();
    resolver = module.get(ImpuestoResolver);
  });

  it('sin id_empresa devuelve [] y no llama al service', async () => {
    const out = await resolver.getImpuestos(undefined, true);
    expect(out).toEqual([]);
    expect(findAll).not.toHaveBeenCalled();
  });

  it('con id_empresa filtra y solo_activos por defecto true', async () => {
    findAll.mockResolvedValue([{ id: 1 }]);
    const out = await resolver.getImpuestos('emp-1', undefined);
    expect(out).toEqual([{ id: 1 }]);
    expect(findAll).toHaveBeenCalledWith({
      id_empresa: 'emp-1',
      solo_activos: true,
    });
  });

  it('solo_activos=false se propaga', async () => {
    findAll.mockResolvedValue([]);
    await resolver.getImpuestos('emp-1', false);
    expect(findAll).toHaveBeenCalledWith({
      id_empresa: 'emp-1',
      solo_activos: false,
    });
  });
});
