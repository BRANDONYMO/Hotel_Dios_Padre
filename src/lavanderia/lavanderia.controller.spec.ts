import { Test, TestingModule } from '@nestjs/testing';
import { LavanderiaController } from './lavanderia.controller';
import { LavanderiaService } from './lavanderia.service';

describe('LavanderiaController', () => {
  let controller: LavanderiaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LavanderiaController],
      providers: [LavanderiaService],
    }).compile();

    controller = module.get<LavanderiaController>(LavanderiaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
