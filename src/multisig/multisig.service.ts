import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { MultiSigConfig } from './entities/multisig-config.entity';
import { CreateMultisigDto } from './dto/create-multisig.dto';

@Injectable()
export class MultisigService {
  constructor(
    @InjectRepository(MultiSigConfig)
    private readonly repo: Repository<MultiSigConfig>,
  ) {}

  async create(
    ownerId: string,
    dto: CreateMultisigDto,
  ): Promise<MultiSigConfig> {
    // Belt-and-suspenders: the DTO validator already enforces this on the
    // HTTP path, but this guards the invariant if create() is ever called
    // from elsewhere (a queue consumer, a script, etc).
    this.assertWeightsSatisfyThresholds(dto);

    const existing = await this.repo.findOne({
      where: { accountId: dto.accountId },
    });

    // POSTing an accountId that already has a config updates it in place,
    // rather than erroring. Flag if you'd rather this be a 409 Conflict.
    if (existing) {
      Object.assign(existing, dto, { ownerId });
      return this.repo.save(existing);
    }

    const config = this.repo.create({ ...dto, ownerId });
    return this.repo.save(config);
  }

  async findByAccountId(accountId: string): Promise<MultiSigConfig> {
    const config = await this.repo.findOne({ where: { accountId } });
    if (!config) {
      throw new NotFoundException(
        `No multisig config found for account ${accountId}`,
      );
    }
    return config;
  }

  private assertWeightsSatisfyThresholds(dto: CreateMultisigDto): void {
    const signerWeightSum = dto.signers.reduce((sum, s) => sum + s.weight, 0);
    const totalWeight = signerWeightSum + dto.masterWeight;
    const highestThreshold = Math.max(
      dto.lowThreshold,
      dto.medThreshold,
      dto.highThreshold,
    );

    if (totalWeight < highestThreshold) {
      throw new UnprocessableEntityException(
        'Sum of signer weights and master weight must meet or exceed the highest threshold',
      );
    }
  }
}