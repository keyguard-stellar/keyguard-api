import {
    IsString,
    IsNotEmpty,
    IsInt,
    Min,
    Max,
    IsArray,
    ArrayMinSize,
    ValidateNested,
    Validate,
    Matches,
    ValidatorConstraint,
    ValidatorConstraintInterface,
    ValidationArguments,
  } from 'class-validator';
  import { Type } from 'class-transformer';
  
  // Stellar Ed25519 public keys: 'G' followed by 55 base32 chars.
  const STELLAR_PUBLIC_KEY_PATTERN = /^G[A-Z2-7]{55}$/;
  
  export class SignerDto {
    @IsString()
    @Matches(STELLAR_PUBLIC_KEY_PATTERN, {
      message: 'publicKey must be a valid Stellar public key',
    })
    publicKey: string;
  
    @IsInt()
    @Min(0)
    @Max(255)
    weight: number;
  }
  
  @ValidatorConstraint({ name: 'signerWeightsSatisfyThresholds', async: false })
  class SignerWeightsSatisfyThresholdsConstraint
    implements ValidatorConstraintInterface
  {
    validate(_value: unknown, args: ValidationArguments): boolean {
      const dto = args.object as CreateMultisigDto;
      const signerWeightSum = (dto.signers ?? []).reduce(
        (sum, signer) => sum + (signer?.weight ?? 0),
        0,
      );
      const totalWeight = signerWeightSum + (dto.masterWeight ?? 0);
      const highestThreshold = Math.max(
        dto.lowThreshold ?? 0,
        dto.medThreshold ?? 0,
        dto.highThreshold ?? 0,
      );
      return totalWeight >= highestThreshold;
    }
  
    defaultMessage(): string {
      return 'Sum of signer weights plus master weight must be greater than or equal to the highest configured threshold';
    }
  }
  
  export class CreateMultisigDto {
    @IsString()
    @Matches(STELLAR_PUBLIC_KEY_PATTERN, {
      message: 'accountId must be a valid Stellar public key',
    })
    accountId: string;
  
    @IsInt()
    @Min(0)
    @Max(255)
    masterWeight: number;
  
    @IsInt()
    @Min(0)
    @Max(255)
    lowThreshold: number;
  
    @IsInt()
    @Min(0)
    @Max(255)
    medThreshold: number;
  
    @IsInt()
    @Min(0)
    @Max(255)
    highThreshold: number;
  
    @IsArray()
    @ArrayMinSize(1)
    @ValidateNested({ each: true })
    @Type(() => SignerDto)
    @Validate(SignerWeightsSatisfyThresholdsConstraint)
    signers: SignerDto[];
  }