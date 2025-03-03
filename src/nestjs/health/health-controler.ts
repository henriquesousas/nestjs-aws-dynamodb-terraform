import { Controller, Get, HttpCode } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  @HttpCode(200)
  async execute(): Promise<{ message: string }> {
    console.log('HealthCheck executing..');
    return await Promise.resolve({
      message: 'OK',
    });
  }
}
