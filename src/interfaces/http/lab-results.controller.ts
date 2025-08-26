import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

import { LabResultsService } from '../../application/services/lab-results.service';
import { CreateLabResultDto } from './dto/create-lab-result.dto';

@Controller('lab-results')
export class LabResultsController {
  constructor (private readonly service: LabResultsService) { }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Store the incoming lab result in a queue or job system for background processing'
  })
  async create(@Body() dto: CreateLabResultDto) {
    const { id } = await this.service.submit(dto);
    return { id, status: 'queued' };
  }
}
