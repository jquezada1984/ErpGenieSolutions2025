import { Test, TestingModule } from '@nestjs/testing';
import { CuentaBancariaResolver } from './cuenta-bancaria.resolver';
import { CuentaBancariaService } from './cuenta-bancaria.service';

describe('CuentaBancariaResolver', () => {
  let resolver: CuentaBancariaResolver;
  const service = {
    findAll: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CuentaBancariaResolver,
        { provide: CuentaBancariaService, useValue: service },
      ],
    }).compile();
    resolver = module.get(CuentaBancariaResolver);
  });

  it('cuentasBancarias propaga id_empresa', async () => {
    service.findAll.mockResolvedValue([]);
    await resolver.cuentasBancarias('emp-1');
    expect(service.findAll).toHaveBeenCalledWith('emp-1');
  });

  it('cuentaBancaria delega findOne', async () => {
    service.findOne.mockResolvedValue({ id_cuenta_bancaria: 'c1' });
    await resolver.cuentaBancaria('c1');
    expect(service.findOne).toHaveBeenCalledWith('c1');
  });
});
