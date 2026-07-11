import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateKeyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  label: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(512)
  publicKey: string;
}