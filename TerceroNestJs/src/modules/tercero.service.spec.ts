import { Test, TestingModule } from '@nestjs/testing';
import { TerceroService } from './tercero/tercero.service';

describe('TerceroService', () => {
  let service: TerceroService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TerceroService],
    }).compile();

    service = module.get<TerceroService>(TerceroService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
