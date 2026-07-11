import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    Index,
  } from 'typeorm';
  
  @Entity('key_records')
  export class KeyRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column({ type: 'varchar', length: 255 })
    label: string;
  
    @Index('idx_key_records_public_key', { unique: true })
    @Column({ type: 'varchar', length: 512, name: 'public_key' })
    publicKey: string;
  
    @Index('idx_key_records_owner_id')
    @Column({ type: 'varchar', length: 255, name: 'owner_id' })
    ownerId: string;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  }