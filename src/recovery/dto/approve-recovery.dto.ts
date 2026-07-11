import { IsString, IsNotEmpty } from 'class-validator';

export class ApproveRecoveryDto {
  // Signature over the recovery request id, produced by the co-signer's
  // Stellar keypair. Verified server-side against the signer's public key
  // on the account's multisig config.
  @IsString()
  @IsNotEmpty()
  signature: string;
}