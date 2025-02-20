import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { USER_PROVIDERS } from './user.provider';
@Module({
  controllers: [UserController],
  providers: [
    ...Object.values(USER_PROVIDERS.REPOSITORIES),
    ...Object.values(USER_PROVIDERS.USECASES),
  ],
})
export class UserModule {}
