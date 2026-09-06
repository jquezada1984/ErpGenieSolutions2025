import { Test, TestingModule } from '@nestjs/testing';
import { DiarioContableResolver } from '../resolvers/diario-contable.resolver';
import { DiarioContableService } from './diario-contable.service';

describe('DiarioContableResolver', () => {
  let resolver: DiarioContableResolver;
  const service = {
    findByEmpresa: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DiarioContableResolver,
        { provide: DiarioContableService, useValue: service },
      ],
    }).compile();
    resolver = module.get(DiarioContableResolver);
  });

  it('diariosContables propaga id_empresa', async () => {
    service.findByEmpresa.mockResolvedValue([]);
    await resolver.diariosContables('emp-1');
    expect(service.findByEmpresa).toHaveBeenCalledWith('emp-1');
  });
});
