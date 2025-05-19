/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('/health-check')
  healthCheck(@Res() res) {
    res.status(200).send('Healthy');
  }
}
