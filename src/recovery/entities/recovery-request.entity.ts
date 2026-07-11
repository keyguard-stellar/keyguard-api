import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
  } from 'typeorm';
  
  export enum RecoveryStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    REJECTED = 'rejected',
    EXPIRED = 'expired',
  }
  
  @Entity('recovery_requests')
  export class RecoveryRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Index('idx_recovery_requests_account_id')
    @Column({ type: 'varchar', length: 56, name: 'account_id' })
    accountId: string;
  
    @Index('idx_recovery_requests_requester_id')
    @Column({ type: 'varchar', length: 255, name: 'requester_id' })
    requesterId: string;
  
    // The key the requester wants installed on the account once recovery
    // is approved.
    @Column({ type: 'varchar', length: 56, name: 'new_public_key' })
    newPublicKey: string;
  
    // Opaque evidence supplied at request time (e.g. a reference to an
    // out-of-band identity check). Not verified by this service — see
    // flags in the accompanying message.
    @Column({ type: 'text', nullable: true })
    proof: string | null;
  
    @Column({ type: 'text', nullable: true })
    reason: string | null;
  
    @Index('idx_recovery_requests_status')
    @Column({
      type: 'enum',
      enum: RecoveryStatus,
      default: RecoveryStatus.PENDING,
    })
    status: RecoveryStatus;
  
    @Column({ type: 'varchar', length: 56, name: 'approved_by', nullable: true })
    approvedBy: string | null;
  
    @Column({ type: 'text', name: 'rejection_reason', nullable: true })
    rejectionReason: string | null;
  
    @Column({ type: 'timestamp', name: 'expires_at' })
    expiresAt: Date;
  
    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
  
    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
  }