import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyAuthDto {
  @IsString()
  @IsNotEmpty()
  transaction: string;
}
