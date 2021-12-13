import {
  Args,
  Mutation,
  Resolver,
  Query,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorater';
import { Role } from 'src/auth/role.decorator';
import {
  CreateRestaurantInput,
  CreateRestaurantOutput,
} from 'src/restaurants/dtos/create-restaurant.dto';
import { User } from 'src/users/entities/user.entity';
import { AllCategoriesOutput } from './dtos/all-categories.dto';
import { CategoryInput, CategoryOutput } from './dtos/category.dto';
import {
  DeleteRestaurantInput,
  DeleteRestaurantOutput,
} from './dtos/delete-restaurant.dto';
import {
  EditRestaurantInput,
  EditRestaurantOutput,
} from './dtos/edit-restaurant.dto';
import { RestaurantInput, RestaurantOutput } from './dtos/restaurant.dto';
import { RestaurantsInput, RestaurantsOutput } from './dtos/restaurants.dto';
import {
  SearchRestaurantInput,
  SearchRestaurantOutput,
} from './dtos/search-restaurant.dto';
import { Category } from './entities/category.entity';
import { Restaurant } from './entities/restaurant.entity';
import { RestaurantService } from './restaurants.service';

@Resolver((of) => Restaurant)
export class RestaurantsResolver {
  //1. Injectable 한 service를 RestaurantResolver 넣어보자
  constructor(private readonly restaurantService: RestaurantService) {}

  //SetMetadata 데코레이터는 두가지 인자를 가진다. 하나는 키 그리고 밸류
  // 메타테이터가 reflector 클래스를 이용해 반영될 수 있다는 것, 이는 metadata에 접근할 수 있음을 뜻한다.
  // role이 UserRole.Owner가 된다.
  // 핵심은 모든 resolver에 메타데이터를 설정하기 위해서 커스텀 데코레이터를 만들어야한다.
  @Mutation((returns) => CreateRestaurantOutput)
  @Role(['Owner'])
  async createRestaurant(
    @AuthUser() authUser: User,
    @Args('input') createRestaurantInput: CreateRestaurantInput,
  ): Promise<CreateRestaurantOutput> {
    return await this.restaurantService.createRestaurant(
      authUser,
      createRestaurantInput,
    );
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  editRestaurant(
    @AuthUser() owner: User,
    @Args('input') editRestaurantInput: EditRestaurantInput,
  ): Promise<EditRestaurantOutput> {
    return this.restaurantService.editRestaurant(owner, editRestaurantInput);
  }

  @Mutation((returns) => EditRestaurantOutput)
  @Role(['Owner'])
  deleteRestaurant(
    @AuthUser() owner: User,
    @Args('input') deleteRestaurantInput: DeleteRestaurantInput,
  ): Promise<DeleteRestaurantOutput> {
    return this.restaurantService.deleteRestaurant(
      owner,
      deleteRestaurantInput,
    );
  }
  @Query((returns) => RestaurantsOutput)
  restaurants(
    @Args('input') restaurantsInput: RestaurantsInput,
  ): Promise<RestaurantsOutput> {
    return this.restaurantService.allRestaurants(restaurantsInput);
  }

  @Query((returns) => RestaurantOutput)
  restaurant(
    @Args('input') restaurantInput: RestaurantInput,
  ): Promise<RestaurantOutput> {
    return this.restaurantService.findRestaurantById(restaurantInput);
  }

  @Query((returns) => SearchRestaurantOutput)
  searchRestaurant(
    @Args('input') searchRestaurantInput: SearchRestaurantInput,
  ): Promise<SearchRestaurantOutput> {
    return this.restaurantService.searchRestaurantByName(searchRestaurantInput);
  }
}

@Resolver((of) => Category)
export class CategoryResolver {
  constructor(private readonly restaurantService: RestaurantService) {}
  // 다이나믹 필드는 db에 저장되지 않는 필드로 요청이 있을 때 마다 계산해서 보여주는 field 이다.
  // computed field,(요청을 보낼때 마다 직접 계산해서 보내지는 필드) dynamic field는 로그인된 사용자의 상태에 따라 계산되는 필드이다.
  // 가령 인스타그램 좋아요, 사용자의 상태에 따라 계산되는 필드로 db에 저장하는 게 아니라 포스트를 보게되는 사용자의 상태에 따라 계산

  // resolverField는 매 요청마다 계산된 필드를 만들어준다.
  @ResolveField((type) => Number)
  restaurantCount(@Parent() category: Category): Promise<number> {
    return this.restaurantService.countRestaurants(category);
  }

  @Query((type) => AllCategoriesOutput)
  allCategories(): Promise<AllCategoriesOutput> {
    return this.restaurantService.allCategories();
  }

  @Query((type) => CategoryOutput)
  category(
    @Args('input') categoryInput: CategoryInput,
  ): Promise<CategoryOutput> {
    return this.restaurantService.findCategoryBySlug(categoryInput);
  }
}
