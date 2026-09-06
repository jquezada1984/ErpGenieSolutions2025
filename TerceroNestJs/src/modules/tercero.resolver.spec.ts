import { Test, TestingModule } from '@nestjs/testing';
import { TerceroResolver } from './tercero/tercero.resolver';
import { TerceroService } from './tercero/tercero.service';
import { MediaService } from './media/media.service';

describe('TerceroResolver', () => {
  let resolver: TerceroResolver;
  const terceroService = {
    findAll: jest.fn(),
    findClientes: jest.fn(),
    findClientesPorBusqueda: jest.fn(),
    findProveedoresPorBusqueda: jest.fn(),
    findOne: jest.fn(),
    findRepresentantesPorEmpresa: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TerceroResolver,
        { provide: TerceroService, useValue: terceroService },
        {
          provide: MediaService,
          useValue: { obtenerLogoPrincipal: jest.fn() },
        },
      ],
    }).compile();
    resolver = module.get(TerceroResolver);
  });

  it('terceros propaga id_empresa al service', async () => {
    terceroService.findAll.mockResolvedValue([]);
    await resolver.findAll('emp-1');
    expect(terceroService.findAll).toHaveBeenCalledWith('emp-1');
  });

  it('terceros sin empresa pasa undefined', async () => {
    terceroService.findAll.mockResolvedValue([]);
    await resolver.findAll(null);
    expect(terceroService.findAll).toHaveBeenCalledWith(undefined);
  });

  it('clientes filtra por id_empresa', async () => {
    terceroService.findClientes.mockResolvedValue([{ id_tercero: 'c1' }]);
    await resolver.findClientes('emp-2');
    expect(terceroService.findClientes).toHaveBeenCalledWith('emp-2');
  });

  it('representantesPorEmpresa exige id_empresa', async () => {
    terceroService.findRepresentantesPorEmpresa.mockResolvedValue([]);
    await resolver.representantesPorEmpresa('emp-3');
    expect(terceroService.findRepresentantesPorEmpresa).toHaveBeenCalledWith(
      'emp-3',
    );
  });
});
