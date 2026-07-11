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

  // Soft-deleted rows are excluded automatically since KeyRecord uses
  // @DeleteDateColumn.
  async findByIdAndOwner(
    id: string,
    ownerId: string,
  ): Promise<KeyRecord | null> {
    return this.repo.findOne({ where: { id, ownerId } });
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

  async update(id: string, data: Partial<KeyRecord>): Promise<void> {
    await this.repo.update({ id }, data);
  }

  async softDelete(id: string): Promise<void> {
    await this.repo.softDelete({ id });
  }
}