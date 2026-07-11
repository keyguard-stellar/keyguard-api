import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MultisigService } from './multisig.service';
import { CreateMultisigDto } from './dto/create-multisig.dto';
import { UpdateMultisigDto } from './dto/update-multisig.dto';

@Controller('multisig')
export class MultisigController {
  constructor(private readonly multisigService: MultisigService) {}

  @Post()
  create(@Body() createMultisigDto: CreateMultisigDto) {
    return this.multisigService.create(createMultisigDto);
  }

  @Get()
  findAll() {
    return this.multisigService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.multisigService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMultisigDto: UpdateMultisigDto) {
    return this.multisigService.update(+id, updateMultisigDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.multisigService.remove(+id);
  }
}
