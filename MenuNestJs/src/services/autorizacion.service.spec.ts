import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AutorizacionService } from './autorizacion.service';
import { PerfilMenuPermiso } from '../entities/perfil-menu-permiso.entity';
import { MenuSeccion } from '../entities/menu-seccion.entity';
import { MenuItem } from '../entities/menu-item.entity';
import { Perfil } from '../entities/perfil.entity';

describe('AutorizacionService', () => {
  let service: AutorizacionService;
  const pmpQb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    addOrderBy: jest.fn().mockReturnThis(),
    getMany: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    Object.values(pmpQb).forEach((fn) => {
      if (typeof fn === 'function' && 'mockReturnThis' in fn) {
        (fn as jest.Mock).mockReturnThis();
      }
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AutorizacionService,
        {
          provide: getRepositoryToken(PerfilMenuPermiso),
          useValue: { createQueryBuilder: jest.fn(() => pmpQb) },
        },
        {
          provide: getRepositoryToken(MenuSeccion),
          useValue: { createQueryBuilder: jest.fn(() => ({
            leftJoinAndSelect: jest.fn().mockReturnThis(),
            where: jest.fn().mockReturnThis(),
            andWhere: jest.fn().mockReturnThis(),
            orderBy: jest.fn().mockReturnThis(),
            addOrderBy: jest.fn().mockReturnThis(),
            getMany: jest.fn().mockResolvedValue([]),
          })) },
        },
        { provide: getRepositoryToken(MenuItem), useValue: {} },
        { provide: getRepositoryToken(Perfil), useValue: {} },
      ],
    }).compile();
    service = module.get(AutorizacionService);
  });

  it('obtenerPermisosPorPerfil filtra por id_perfil y permitido', async () => {
    pmpQb.getMany.mockResolvedValue([
      {
        id_item: 'i1',
        permitido: true,
        menuItem: {
          etiqueta: 'Productos',
          ruta: '/items',
          icono: null,
          seccion: { id_seccion: 's1', nombre: 'Items', orden: 1 },
        },
      },
    ]);
    const rows = await service.obtenerPermisosPorPerfil('perfil-1');
    expect(pmpQb.where).toHaveBeenCalledWith('pmp.id_perfil = :id_perfil', {
      id_perfil: 'perfil-1',
    });
    expect(pmpQb.andWhere).toHaveBeenCalledWith('pmp.permitido = :permitido', {
      permitido: true,
    });
    expect(rows[0].etiqueta).toBe('Productos');
  });
});
