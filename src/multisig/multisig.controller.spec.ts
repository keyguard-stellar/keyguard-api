import { Test, TestingModule } from '@nestjs/testing';
import { MultisigController } from './multisig.controller';
import { MultisigService } from './multisig.service';

describe('MultisigController', () => {
  let controller: MultisigController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MultisigController],
      providers: [MultisigService],
    }).compile();

    controller = module.get<MultisigController>(MultisigController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
