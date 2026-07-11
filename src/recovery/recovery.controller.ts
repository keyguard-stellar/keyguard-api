import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';

import { RecoveryService } from './recovery.service';
import { CreateRecoveryDto } from './dto/create-recovery.dto';
import { RejectRecoveryDto } from './dto/reject-recovery.dto';
import { ApproveRecoveryDto } from './dto/approve-recovery.dto';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

@UseGuards()
@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('request')
  create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreateRecoveryDto,
  ) {
    return this.recoveryService.createRequest(req.user.userId, dto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.recoveryService.findById(id);
  }

  @Post(':id/approve')
  approve(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: ApproveRecoveryDto,
  ) {
    // NOTE: userId here must be a Stellar public key for the signature
    // check to work — see flags below re: JWT subject shape.
    return this.recoveryService.approve(id, req.user.userId, dto);
  }

  @Post(':id/reject')
  reject(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() dto: RejectRecoveryDto,
  ) {
    return this.recoveryService.reject(id, req.user.userId, dto);
  }
}