import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';
import { KeysRepository } from './keys.repository';
import { KeyRecord } from './entities/key.entity';

@Injectable()
export class KeysService {
  constructor(private readonly keysRepository: KeysRepository) {}

  create(ownerId: string, createKeyDto: CreateKeyDto): Promise<KeyRecord> {
    return this.keysRepository.create({ ...createKeyDto, ownerId });
  }

  findAll(ownerId: string): Promise<KeyRecord[]> {
    return this.keysRepository.findByOwnerId(ownerId);
  }

  async findOne(id: string, ownerId: string): Promise<KeyRecord> {
    const record = await this.keysRepository.findByIdAndOwner(id, ownerId);
    if (!record) {
      throw new NotFoundException(`Key ${id} not found`);
    }
    return record;
  }

  async update(
    id: string,
    ownerId: string,
    updateKeyDto: UpdateKeyDto,
  ): Promise<KeyRecord> {
    // Ensures the record exists AND belongs to the caller before mutating.
    await this.findOne(id, ownerId);
    await this.keysRepository.update(id, updateKeyDto);
    return this.findOne(id, ownerId);
  }

  async remove(id: string, ownerId: string): Promise<void> {
    await this.findOne(id, ownerId);
    await this.keysRepository.softDelete(id);
  }
}