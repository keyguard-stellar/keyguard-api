import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeysService } from './keys.service';
import { KeysController } from './keys.controller';
import { KeysRepository } from './keys.repository';
import { KeyRecord } from './entities/key.entity';

@Module({
  imports: [TypeOrmModule.forFeature([KeyRecord])],
  controllers: [KeysController],
  providers: [KeysService, KeysRepository],
  exports: [KeysRepository],
})
export class KeysModule {}