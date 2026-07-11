import { PartialType } from '@nestjs/mapped-types';
import { CreateMultisigDto } from './create-multisig.dto';

export class UpdateMultisigDto extends PartialType(CreateMultisigDto) {}
