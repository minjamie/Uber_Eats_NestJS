import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Verification } from './entities/verification.entity';
import { UsersResolver } from './user.resolver';
import { UsersService } from './user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Verification])],
  // nestjs 방식으로 환경변수를 쓰기 위해선 configModule을 import 내애 적어줘서 받아온다.
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
})
export class UsersModule {}
