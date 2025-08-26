import { Controller, Get, HttpStatus, Res } from '@nestjs/common';

import { join } from 'path';
import { Response } from 'express';
import { ApiResponse } from '@nestjs/swagger';

@Controller()
export class DashboardController {

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Simple html page to show current jobs status'
  })
  root(@Res() res: Response) {
    res.sendFile(join(__dirname, '..', '..', 'public', 'index.html'));
  }
}
