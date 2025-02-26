import { Module } from '@nestjs/common';
import { UserModule } from './nestjs/user/user.module';
import { ConfigModule } from './nestjs/@shared/config/config.module';

@Module({
  imports: [ConfigModule.forRoot(), UserModule],
})
export class AppModule {}
