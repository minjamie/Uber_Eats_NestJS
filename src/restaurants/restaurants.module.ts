import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Restaurant } from './entities/restaurant.entity';
import { CategoryRepository } from './repositories/catogory.repository';
import { CategoryResolver, RestaurantsResolver } from './restaurants.resovler';
import { RestaurantService } from './restaurants.service';

@Module({
  //CategoryRepository 로드할 수 있게 inject
  imports: [TypeOrmModule.forFeature([Restaurant, CategoryRepository])],
  providers: [RestaurantsResolver, RestaurantService, CategoryResolver],
})
export class RestaurantsModule {}
