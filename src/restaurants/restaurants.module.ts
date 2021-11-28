import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantsResolver } from './restaurants.resovler';
import { RestaurantService } from './restaurants.service';

@Module({
  imports: [TypeOrmModule.forFeature([Restaurant])],
  // 1. TypeOrm을 이용해서 Restaurants repository를 import한다.
  // TypeOrmModule.forFeature에 배열 형태로 entity 클래스들을 넣기
  providers: [RestaurantsResolver, RestaurantService],
})
export class RestaurantsModule {}
