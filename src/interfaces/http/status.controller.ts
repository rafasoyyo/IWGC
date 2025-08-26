import { Controller, Get, HttpStatus } from '@nestjs/common';

import { LabResultsService } from '../../application/services/lab-results.service';
import { ApiResponse } from '@nestjs/swagger';

@Controller('status')
export class StatusController {
  constructor (private readonly service: LabResultsService) { }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Return current jobs status'
  })
  async status() {
    return this.service.status();
  }
}
