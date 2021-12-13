import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './auth.guard';

@Module({
  providers: [
    {
      // 1.app_guard를 제공해주면 모든 곳에서 guard를 사용가능
      provide: APP_GUARD,
      // 2.useClass에 AuthGuard를 사용하면 모든곳에서 작동한다 .
      useClass: AuthGuard,
    },
  ],
})
export class AuthModule {}
