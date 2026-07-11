import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

// Only label is mutable per the acceptance criteria — publicKey and
// ownerId are immutable after creation.
export class UpdateKeyDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  label: string;
}