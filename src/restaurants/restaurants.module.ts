import { Module } from '@nestjs/common';
import { RestaurantsResolver } from './restaurants.resovler';

@Module({
  // 1. providers에 리졸버 추가
  providers: [RestaurantsResolver],
})
export class RestaurantsModule {}
