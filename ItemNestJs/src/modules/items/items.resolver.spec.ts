import { Test, TestingModule } from '@nestjs/testing';
import { ItemsResolver } from './items.resolver';
import { ItemsService } from './items.service';

describe('ItemsResolver', () => {
  let resolver: ItemsResolver;
  const itemsService = {
    listado: jest.fn(),
    findDetalleEdicion: jest.fn(),
    actualizarEstado: jest.fn(),
    actualizarEstadoInventario: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemsResolver,
        { provide: ItemsService, useValue: itemsService },
      ],
    }).compile();
    resolver = module.get(ItemsResolver);
  });

  it('itemsListado propaga id_empresa', async () => {
    itemsService.listado.mockResolvedValue([]);
    await resolver.itemsListado('emp-9');
    expect(itemsService.listado).toHaveBeenCalledWith(
      expect.objectContaining({ id_empresa: 'emp-9' }),
    );
  });

  it('itemsListado sin empresa pasa undefined', async () => {
    itemsService.listado.mockResolvedValue([]);
    await resolver.itemsListado(undefined);
    expect(itemsService.listado).toHaveBeenCalledWith(
      expect.objectContaining({ id_empresa: undefined }),
    );
  });
});
