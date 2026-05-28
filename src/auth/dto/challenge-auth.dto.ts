import { IsNotEmpty, IsString } from 'class-validator';

export class ChallengeAuthDto {
  @IsString()
  @IsNotEmpty()
  publicKey: string;
}
