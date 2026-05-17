import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { Keypair, Networks, Transaction } from 'stellar-sdk';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let clientKeypair: Keypair;

  beforeEach(async () => {
    clientKeypair = Keypair.random();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: {
            get: (key: string, defaultValue?: any) => {
              if (key === 'STELLAR_SERVER_PRIVATE_KEY') {
                return 'SAWSX2GDIONPN7WLUHKFLJPIMWGHG7OB4VKBHT6YACNZDKL2QHB2Y5ZX';
              }
              if (key === 'STELLAR_NETWORK') {
                return 'TESTNET';
              }
              if (key === 'AUTH_HOME_DOMAIN') {
                return 'keyguard.org';
              }
              return defaultValue;
            },
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: () => 'mock-jwt-token',
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateChallenge', () => {
    it('should generate a valid challenge transaction for a valid public key', () => {
      const result = service.generateChallenge(clientKeypair.publicKey());
      expect(result).toHaveProperty('transaction');
      expect(typeof result.transaction).toBe('string');
    });

    it('should throw BadRequestException for an invalid public key', () => {
      expect(() => service.generateChallenge('invalid-key')).toThrow(
        BadRequestException,
      );
    });
  });

  describe('verifyChallenge', () => {
    it('should verify a valid signed challenge transaction', () => {
      const { transaction } = service.generateChallenge(
        clientKeypair.publicKey(),
      );

      const clientTx = new Transaction(transaction, Networks.TESTNET);
      clientTx.sign(clientKeypair);
      const signedTxXdr = clientTx.toEnvelope().toXDR('base64');

      const result = service.verifyChallenge(signedTxXdr);
      expect(result).toEqual({
        accessToken: 'mock-jwt-token',
        token: 'mock-jwt-token',
      });
    });

    it('should throw UnauthorizedException for an invalid signature', () => {
      const { transaction } = service.generateChallenge(
        clientKeypair.publicKey(),
      );

      const wrongKeypair = Keypair.random();
      const clientTx = new Transaction(transaction, Networks.TESTNET);
      clientTx.sign(wrongKeypair);
      const signedTxXdr = clientTx.toEnvelope().toXDR('base64');

      expect(() => service.verifyChallenge(signedTxXdr)).toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for an unsigned transaction', () => {
      const { transaction } = service.generateChallenge(
        clientKeypair.publicKey(),
      );
      expect(() => service.verifyChallenge(transaction)).toThrow(
        UnauthorizedException,
      );
    });
  });
});
