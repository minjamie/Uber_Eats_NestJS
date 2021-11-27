import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRestaurantDto } from 'src/dtos/create-restaurant.dto';
import { Restaurants } from './entities/restaurants.entity';

// 레스토랑 entity를 인자로 작성해준다.
// 이렇게 해주면 Resolver가 Restaurants의 Resolver 임을 명시(옵션)해줄 수 있다.
@Resolver((of) => Restaurants)
//2.  Resolver 데코레이터 생성
export class RestaurantsResolver {
  @Query((returns) => [Restaurants])
  // 그래프 큐엘에 타입지정하는 방식
  myRestaurant(@Args('veganOnly') veganOnly: boolean): Restaurants[] {
    // nestjs에 타입지정하는 방식
    // 인자를 받기 위해서 @Args 요청해야한다.
    return [];
  }

  @Mutation((returns) => Boolean)
  createRestaurant(@Args() createRestaurantDto: CreateRestaurantDto): boolean {
    console.log(createRestaurantDto);
    return true;
  }
}
