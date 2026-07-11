import { Injectable } from '@nestjs/common';
import { CreateMultisigDto } from './dto/create-multisig.dto';
import { UpdateMultisigDto } from './dto/update-multisig.dto';

@Injectable()
export class MultisigService {
  create(createMultisigDto: CreateMultisigDto) {
    return 'This action adds a new multisig';
  }

  findAll() {
    return `This action returns all multisig`;
  }

  findOne(id: number) {
    return `This action returns a #${id} multisig`;
  }

  update(id: number, updateMultisigDto: UpdateMultisigDto) {
    return `This action updates a #${id} multisig`;
  }

  remove(id: number) {
    return `This action removes a #${id} multisig`;
  }
}
