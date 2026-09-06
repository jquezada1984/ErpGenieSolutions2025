import { Test, TestingModule } from '@nestjs/testing';
import { InventarioResolver } from './inventario.resolver';
import { InventarioService } from './inventario.service';

describe('InventarioResolver', () => {
  let resolver: InventarioResolver;
  const inventarioService = {
    inventariosListado: jest.fn(),
    almacenesPorEmpresa: jest.fn(),
    inventarioPorId: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        InventarioResolver,
        { provide: InventarioService, useValue: inventarioService },
      ],
    }).compile();
    resolver = module.get(InventarioResolver);
  });

  it('inventariosListado propaga id_empresa', async () => {
    inventarioService.inventariosListado.mockResolvedValue([]);
    await resolver.inventariosListado('emp-1');
    expect(inventarioService.inventariosListado).toHaveBeenCalledWith(
      expect.objectContaining({ id_empresa: 'emp-1' }),
    );
  });

  it('almacenesPorEmpresa propaga id_empresa', async () => {
    inventarioService.almacenesPorEmpresa.mockResolvedValue([]);
    await resolver.almacenesPorEmpresa('emp-3', true);
    expect(inventarioService.almacenesPorEmpresa).toHaveBeenCalledWith(
      'emp-3',
      true,
    );
  });
});
