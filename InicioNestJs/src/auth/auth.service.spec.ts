import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { Usuario } from '../entities/usuario.entity';
import { Perfil } from '../entities/perfil.entity';
import { AutorizacionService } from '../services/autorizacion.service';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  const jwtSign = jest.fn().mockReturnValue('token-jwt');
  const jwtVerify = jest.fn();
  const qb = {
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };
  const usuarioRepository = {
    createQueryBuilder: jest.fn(() => qb),
    manager: { query: jest.fn().mockResolvedValue([{ db: 'erp_test' }]) },
  };
  const autorizacionService = {
    obtenerOpcionesMenuSuperior: jest.fn().mockResolvedValue([]),
    obtenerPermisosPorModulo: jest.fn().mockResolvedValue({ mod: ['r'] }),
    obtenerPerfilConPermisos: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    qb.leftJoinAndSelect.mockReturnThis();
    qb.where.mockReturnThis();
    qb.andWhere.mockReturnThis();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(Usuario), useValue: usuarioRepository },
        { provide: getRepositoryToken(Perfil), useValue: {} },
        { provide: JwtService, useValue: { sign: jwtSign, verify: jwtVerify } },
        { provide: AutorizacionService, useValue: autorizacionService },
      ],
    }).compile();
    service = module.get(AuthService);
  });

  describe('validateToken', () => {
    it('devuelve payload si el JWT es válido', async () => {
      jwtVerify.mockReturnValue({
        sub: 'u1',
        scope_acceso: 'GLOBAL',
        id_empresa: 'e1',
      });
      await expect(service.validateToken('tok')).resolves.toMatchObject({
        scope_acceso: 'GLOBAL',
      });
    });

    it('lanza UnauthorizedException si el token es inválido', async () => {
      jwtVerify.mockImplementation(() => {
        throw new Error('bad');
      });
      await expect(service.validateToken('bad')).rejects.toBeInstanceOf(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('incluye scope_acceso en el payload JWT', async () => {
      qb.getOne.mockResolvedValue({
        id_usuario: 'u1',
        email: 'a@b.com',
        username: 'a',
        password_hash: 'hash',
        nombre_completo: 'Ana Perez',
        estado: true,
        scope_acceso: 'GLOBAL',
        perfil: {
          id_perfil: 'p1',
          id_empresa: 'emp-1',
          nombre: 'Admin',
          estado: true,
        },
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const res = await service.login('a@b.com', 'secret');
      expect(res.accessToken).toBe('token-jwt');
      expect(jwtSign).toHaveBeenCalledWith(
        expect.objectContaining({
          sub: 'u1',
          id_empresa: 'emp-1',
          scope_acceso: 'GLOBAL',
        }),
      );
    });

    it('usa EMPRESA por defecto si scope_acceso es null', async () => {
      qb.getOne.mockResolvedValue({
        id_usuario: 'u2',
        email: 'c@d.com',
        username: 'c',
        password_hash: 'hash',
        nombre_completo: 'Carlos',
        estado: true,
        scope_acceso: null,
        perfil: {
          id_perfil: 'p2',
          id_empresa: 'emp-2',
          nombre: 'User',
          estado: true,
        },
      });
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await service.login('c@d.com', 'x');
      expect(jwtSign).toHaveBeenCalledWith(
        expect.objectContaining({ scope_acceso: 'EMPRESA' }),
      );
    });
  });
});
