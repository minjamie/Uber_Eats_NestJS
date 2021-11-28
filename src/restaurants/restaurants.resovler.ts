import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { create } from 'domain';
import { CreateRestaurantDto } from 'src/dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from 'src/dtos/update-restaurant.dto';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  //1. Injectable 한 service를 RestaurantResolver 넣어보자
  constructor(private readonly restaurantService: RestaurantService) {}
  @Query((returns) => [Restaurant])
  myRestaurant(): Promise<Restaurant[]> {
    // 이 RestaurantsResolver는 서비스를 사용할 수 있음
    return this.restaurantService.getAll();
  }
  @Mutation((returns) => Boolean)
  async createRestaurant(
    @Args('input') createRestaurantDto: CreateRestaurantDto,
  ): Promise<boolean> {
    console.log(createRestaurantDto);
    try {
      await this.restaurantService.createRestaurant(createRestaurantDto);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  @Mutation((returns) => Boolean)
  // resolver mutation에 어떤 레스토랑을 수정할 지 알려주기 위해 id를 보내야함
  async updateRestaurant(
    // 옵션 1 -
    @Args('data') updateRestaurantDto: UpdateRestaurantDto,
  ): Promise<boolean> {
    try {
      await this.restaurantService.updateRestaurant(updateRestaurantDto);
      return true;
    } catch (error) {
      return false;
    }
  }
}
