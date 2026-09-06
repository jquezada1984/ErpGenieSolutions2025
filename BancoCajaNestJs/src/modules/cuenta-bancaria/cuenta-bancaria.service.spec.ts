import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { CuentaBancariaService } from './cuenta-bancaria.service';
import { CuentaBancaria } from './entities/cuenta-bancaria.entity';

describe('CuentaBancariaService', () => {
  let service: CuentaBancariaService;
  const find = jest.fn();
  const findOne = jest.fn();

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaBancariaService,
        {
          provide: getRepositoryToken(CuentaBancaria),
          useValue: { find, findOne },
        },
      ],
    }).compile();
    service = module.get(CuentaBancariaService);
  });

  it('findAll filtra por id_empresa', async () => {
    find.mockResolvedValue([]);
    await service.findAll('emp-1');
    expect(find).toHaveBeenCalledWith({
      where: { id_empresa: 'emp-1' },
      relations: ['banco'],
      order: { created_at: 'DESC' },
    });
  });

  it('findOne lanza NotFoundException', async () => {
    findOne.mockResolvedValue(null);
    await expect(service.findOne('missing')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
