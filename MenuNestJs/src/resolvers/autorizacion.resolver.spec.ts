import { Test, TestingModule } from '@nestjs/testing';
import { AutorizacionResolver } from './autorizacion.resolver';
import { AutorizacionService } from '../services/autorizacion.service';

describe('AutorizacionResolver', () => {
  let resolver: AutorizacionResolver;
  const service = {
    obtenerPermisosPorPerfil: jest.fn(),
    obtenerMenuLateralPorPerfil: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutorizacionResolver,
        { provide: AutorizacionService, useValue: service },
      ],
    }).compile();
    resolver = module.get(AutorizacionResolver);
  });

  it('permisosPorPerfil propaga id_perfil', async () => {
    service.obtenerPermisosPorPerfil.mockResolvedValue([]);
    await resolver.permisosPorPerfil('perfil-1');
    expect(service.obtenerPermisosPorPerfil).toHaveBeenCalledWith('perfil-1');
  });

  it('menuLateralPorPerfil propaga id_perfil', async () => {
    service.obtenerMenuLateralPorPerfil.mockResolvedValue([]);
    await resolver.menuLateralPorPerfil('perfil-2');
    expect(service.obtenerMenuLateralPorPerfil).toHaveBeenCalledWith('perfil-2');
  });
});
