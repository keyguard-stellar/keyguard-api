import {
  Injectable,
  NotFoundException,
  ConflictException,
  UnprocessableEntityException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Keypair } from 'stellar-sdk';

import { RecoveryRequest, RecoveryStatus } from './entities/recovery-request.entity';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { ApproveRecoveryDto } from './dto/approve-recovery.dto';
import { RejectRecoveryDto } from './dto/reject-recovery.dto';
import { MultisigService } from '../multisig/multisig.service';

const RECOVERY_WINDOW_HOURS = 48;

@Injectable()
export class RecoveryService {
  private readonly logger = new Logger(RecoveryService.name);

  constructor(
    @InjectRepository(RecoveryRequest)
    private readonly repo: Repository<RecoveryRequest>,
    private readonly multisigService: MultisigService,
  ) {}

  async createRequest(
    requesterId: string,
    dto: CreateRecoveryDto,
  ): Promise<RecoveryRequest> {
    const existingPending = await this.repo.findOne({
      where: { accountId: dto.accountId, status: RecoveryStatus.PENDING },
    });
    if (existingPending) {
      throw new ConflictException(
        'A pending recovery request already exists for this account',
      );
    }

    const expiresAt = new Date(
      Date.now() + RECOVERY_WINDOW_HOURS * 60 * 60 * 1000,
    );

    const request = this.repo.create({
      ...dto,
      requesterId,
      status: RecoveryStatus.PENDING,
      expiresAt,
    });

    // Co-signer notification intentionally omitted for now — see PR note.
    return this.repo.save(request);
  }

  async findById(id: string): Promise<RecoveryRequest> {
    const request = await this.repo.findOne({ where: { id } });
    if (!request) {
      throw new NotFoundException(`Recovery request ${id} not found`);
    }
    return request;
  }

  async approve(
    id: string,
    approverPublicKey: string,
    dto: ApproveRecoveryDto,
  ): Promise<RecoveryRequest> {
    const request = await this.findById(id);
    this.assertPending(request);

    const config = await this.multisigService.findByAccountId(
      request.accountId,
    );
    const isAuthorizedSigner = config.signers.some(
      (s) => s.publicKey === approverPublicKey,
    );
    if (!isAuthorizedSigner) {
      throw new UnprocessableEntityException(
        'Approver is not a registered co-signer for this account',
      );
    }

    this.verifyApprovalSignature(request.id, approverPublicKey, dto.signature);

    request.status = RecoveryStatus.APPROVED;
    request.approvedBy = approverPublicKey;
    return this.repo.save(request);
  }

  async reject(
    id: string,
    _rejecterId: string,
    dto: RejectRecoveryDto,
  ): Promise<RecoveryRequest> {
    const request = await this.findById(id);
    this.assertPending(request);

    request.status = RecoveryStatus.REJECTED;
    request.rejectionReason = dto.reason ?? null;
    return this.repo.save(request);
  }

  // Invoked by RecoveryScheduler on a cron.
  async expireStaleRequests(): Promise<number> {
    const now = new Date();
    const stale = await this.repo.find({
      where: { status: RecoveryStatus.PENDING },
    });
    const toExpire = stale.filter((r) => r.expiresAt <= now);

    if (toExpire.length === 0) return 0;

    for (const request of toExpire) {
      request.status = RecoveryStatus.EXPIRED;
    }
    await this.repo.save(toExpire);

    this.logger.log(`Expired ${toExpire.length} stale recovery request(s)`);
    return toExpire.length;
  }

  private assertPending(request: RecoveryRequest): void {
    if (request.status !== RecoveryStatus.PENDING) {
      throw new ConflictException(
        `Recovery request is already ${request.status}`,
      );
    }
    if (request.expiresAt <= new Date()) {
      throw new ConflictException('Recovery request has expired');
    }
  }

  private verifyApprovalSignature(
    requestId: string,
    signerPublicKey: string,
    signatureBase64: string,
  ): void {
    try {
      const keypair = Keypair.fromPublicKey(signerPublicKey);
      const verified = keypair.verify(
        Buffer.from(requestId),
        Buffer.from(signatureBase64, 'base64'),
      );
      if (!verified) {
        throw new Error('signature mismatch');
      }
    } catch {
      throw new UnprocessableEntityException(
        'Invalid approval signature for this co-signer',
      );
    }
  }
}