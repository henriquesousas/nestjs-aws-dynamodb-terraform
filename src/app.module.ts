import { Module } from '@nestjs/common';
import { UserModule } from './nestjs/user/user.module';

@Module({
  imports: [UserModule],
})
export class AppModule {}
