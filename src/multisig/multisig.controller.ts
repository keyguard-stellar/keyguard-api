import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Request } from 'express';

import { MultisigService } from './multisig.service';
import { CreateMultisigDto } from './dto/create-multisig.dto';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

@UseGuards()
// Overrides the global pipe's default 400 (BadRequestException) with 422,
// as required by the acceptance criteria. This runs in addition to the
// global ValidationPipe in main.ts — redundant but harmless, since the
// body is already a validated DTO instance by the time this pipe re-checks it.
@UsePipes(
  new ValidationPipe({
    whitelist: true,
    transform: true,
    forbidNonWhitelisted: true,
    exceptionFactory: (errors) => new UnprocessableEntityException(errors),
  }),
)
@Controller('multisig')
export class MultisigController {
  constructor(private readonly multisigService: MultisigService) {}

  @Post('config')
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createMultisigDto: CreateMultisigDto,
  ) {
    return this.multisigService.create(req.user.userId, createMultisigDto);
  }

  @Get('config/:accountId')
  findOne(@Param('accountId') accountId: string) {
    return this.multisigService.findByAccountId(accountId);
  }
}