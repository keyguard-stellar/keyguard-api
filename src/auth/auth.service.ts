import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Keypair, Networks, WebAuth } from 'stellar-sdk';

@Injectable()
export class AuthService {
  private serverKeypair: Keypair;
  private networkPassphrase: string;
  private homeDomain: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
  ) {
    const secret = this.configService.get<string>(
      'STELLAR_SERVER_PRIVATE_KEY',
      'SAWSX2GDIONPN7WLUHKFLJPIMWGHG7OB4VKBHT6YACNZDKL2QHB2Y5ZX',
    );
    this.serverKeypair = Keypair.fromSecret(secret);

    this.networkPassphrase =
      this.configService.get<string>('STELLAR_NETWORK') === 'PUBLIC'
        ? Networks.PUBLIC
        : Networks.TESTNET;

    this.homeDomain = this.configService.get<string>(
      'AUTH_HOME_DOMAIN',
      'keyguard.org',
    );
  }

  generateChallenge(publicKey: string) {
    try {
      Keypair.fromPublicKey(publicKey);
    } catch {
      throw new BadRequestException('Invalid Stellar public key');
    }

    const transaction = WebAuth.buildChallengeTx(
      this.serverKeypair,
      publicKey,
      this.homeDomain,
      300, // 5 minutes timeout
      this.networkPassphrase,
      this.homeDomain, // webAuthDomain
    );

    return { transaction };
  }

  verifyChallenge(transactionXdr: string) {
    try {
      const { clientAccountID } = WebAuth.readChallengeTx(
        transactionXdr,
        this.serverKeypair.publicKey(),
        this.networkPassphrase,
        this.homeDomain,
        this.homeDomain,
      );

      WebAuth.verifyChallengeTxSigners(
        transactionXdr,
        this.serverKeypair.publicKey(),
        this.networkPassphrase,
        [clientAccountID],
        this.homeDomain,
        this.homeDomain,
      );

      const payload = { sub: clientAccountID, publicKey: clientAccountID };
      const accessToken = this.jwtService.sign(payload);

      return { accessToken, token: accessToken };
    } catch (error) {
      throw new UnauthorizedException(
        `Invalid challenge transaction or signature: ${error instanceof Error ? error.message : 'Unauthorized'}`,
      );
    }
  }
}
