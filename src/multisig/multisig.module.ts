import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MultisigService } from './multisig.service';
import { MultisigController } from './multisig.controller';
import { MultiSigConfig } from './entities/multisig-config.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MultiSigConfig])],
  controllers: [MultisigController],
  providers: [MultisigService],
  exports: [MultisigService],
})
export class MultisigModule {}