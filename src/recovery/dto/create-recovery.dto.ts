import { IsString, IsNotEmpty, IsOptional, Matches } from 'class-validator';

const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;

export class CreateRecoveryDto {
  @IsString()
  @Matches(STELLAR_PUBLIC_KEY_PATTERN, {
    message: 'accountId must be a valid Stellar public key',
  })
  accountId: string;

  @IsString()
  @Matches(STELLAR_PUBLIC_KEY_PATTERN, {
    message: 'newPublicKey must be a valid Stellar public key',
  })
  newPublicKey: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  proof?: string;

  @IsOptional()
  @IsString()
  reason?: string;
}