import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export interface Signer {
    publicKey: string;
    weight: number;
  }
  
  @Entity('multisig_configs')
  export class MultiSigConfig {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Index('idx_multisig_configs_account_id', { unique: true })
    @Column({ type: 'varchar', length: 56, name: 'account_id' })
    accountId: string;
  
    @Index('idx_multisig_configs_owner_id')
    @Column({ type: 'varchar', length: 255, name: 'owner_id' })
    ownerId: string;
  
    @Column({ type: 'int', name: 'master_weight' })
    masterWeight: number;
  
    @Column({ type: 'int', name: 'low_threshold' })
    lowThreshold: number;
  
    @Column({ type: 'int', name: 'med_threshold' })
    medThreshold: number;
  
    @Column({ type: 'int', name: 'high_threshold' })
    highThreshold: number;
  
    @Column({ type: 'jsonb' })
    signers: Signer[];
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }