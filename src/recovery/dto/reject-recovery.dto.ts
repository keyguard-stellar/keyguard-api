import { IsString, IsOptional } from 'class-validator';

export class RejectRecoveryDto {
  @IsOptional()
  @IsString()
  reason?: string;
}