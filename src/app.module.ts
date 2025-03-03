import { Module } from '@nestjs/common';
import { UserModule } from './nestjs/user/user.module';
import { ConfigModule } from './nestjs/@shared/config/config.module';
import { HealthModule } from './nestjs/health/health-module';

@Module({
  imports: [ConfigModule.forRoot(), HealthModule, UserModule],
})
export class AppModule {}
