import { Test, TestingModule } from '@nestjs/testing';
import { PlatformAdminController } from './platform-admin.controller';

describe('PlatformAdminController', () => {
  let controller: PlatformAdminController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlatformAdminController],
    }).compile();

    controller = module.get<PlatformAdminController>(PlatformAdminController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
