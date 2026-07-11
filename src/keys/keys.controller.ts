import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request } from 'express';

import { KeysService } from './keys.service';
import { CreateKeyDto } from './dto/create-key.dto';
import { UpdateKeyDto } from './dto/update-key.dto';

interface AuthenticatedRequest extends Request {
  user: { userId: string };
}

@UseGuards()
@Controller('keys')
export class KeysController {
  constructor(private readonly keysService: KeysService) {}

  @Post()
  create(
    @Req() req: AuthenticatedRequest,
    @Body() createKeyDto: CreateKeyDto,
  ) {
    return this.keysService.create(req.user.userId, createKeyDto);
  }

  @Get()
  findAll(@Req() req: AuthenticatedRequest) {
    return this.keysService.findAll(req.user.userId);
  }

  @Get(':id')
  findOne(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.keysService.findOne(id, req.user.userId);
  }

  @Patch(':id')
  update(
    @Req() req: AuthenticatedRequest,
    @Param('id') id: string,
    @Body() updateKeyDto: UpdateKeyDto,
  ) {
    return this.keysService.update(id, req.user.userId, updateKeyDto);
  }

  @Delete(':id')
  remove(@Req() req: AuthenticatedRequest, @Param('id') id: string) {
    return this.keysService.remove(id, req.user.userId);
  }
}