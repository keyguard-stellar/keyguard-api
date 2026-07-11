import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { KeyRecord } from './entities/key.entity';


@Injectable()
export class KeysRepository {
  constructor(
    @InjectRepository(KeyRecord)
    private readonly repo: Repository<KeyRecord>,
  ) {}

  async create(data: Partial<KeyRecord>): Promise<KeyRecord> {
    const record = this.repo.create(data);
    return this.repo.save(record);
  }

  async findById(id: string): Promise<KeyRecord | null> {
    return this.repo.findOne({ where: { id } });
  }

  async findByPublicKey(publicKey: string): Promise<KeyRecord | null> {
    return this.repo.findOne({ where: { publicKey } });
  }

  async findByOwnerId(ownerId: string): Promise<KeyRecord[]> {
    return this.repo.find({
      where: { ownerId },
      order: { createdAt: 'DESC' },
    });
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }
}