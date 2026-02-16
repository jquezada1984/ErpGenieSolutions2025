import { Test, TestingModule } from '@nestjs/testing';
import { TerceroController } from './tercero.controller';

describe('TerceroController', () => {
  let controller: TerceroController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TerceroController],
    }).compile();

    controller = module.get<TerceroController>(TerceroController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
