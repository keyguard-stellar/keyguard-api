import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { ChallengeAuthDto } from './dto/challenge-auth.dto';
import { VerifyAuthDto } from './dto/verify-auth.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            generateChallenge: jest
              .fn()
              .mockReturnValue({ transaction: 'mock-tx' }),
            verifyChallenge: jest.fn().mockReturnValue({
              accessToken: 'mock-token',
              token: 'mock-token',
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should call generateChallenge on getChallenge', () => {
    const dto: ChallengeAuthDto = { publicKey: 'G123' };
    const spy = jest.spyOn(service, 'generateChallenge');
    expect(controller.getChallenge(dto)).toEqual({ transaction: 'mock-tx' });
    expect(spy).toHaveBeenCalledWith('G123');
  });

  it('should call verifyChallenge on verifyChallenge', () => {
    const dto: VerifyAuthDto = { transaction: 'mock-signed-tx' };
    const spy = jest.spyOn(service, 'verifyChallenge');
    expect(controller.verifyChallenge(dto)).toEqual({
      accessToken: 'mock-token',
      token: 'mock-token',
    });
    expect(spy).toHaveBeenCalledWith('mock-signed-tx');
  });
});
