import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateRestaurantDto } from 'src/dtos/create-restaurant.dto';
import { UpdateRestaurantDto } from 'src/dtos/update-restaurant.dto';
import { In, Repository } from 'typeorm';
import { Restaurant } from './entities/restaurant.entity';

@Injectable()
// Injectable 데코레이터로 서비스를 만들어준다.
export class RestaurantService {
  // RestaurantService에서 repository를 사용하기 위해서  service를 resolver에서 import중
  // 그리고 module에서 import한  repository를 inject해야함
  constructor(
    @InjectRepository(Restaurant)
    private readonly restaurants: Repository<Restaurant>,
  ) {}
  // Restaurant entity의 repository를 inject하여 이름인 restaurants인 class는 Restaurant entity를 가진 Repository이다.
  getAll(): Promise<Restaurant[]> {
    // this.restaurants.하면 repository에 접근해 모든걸 할수 있다.
    //repository를 inject하고 나면 restaurants.module에서 모든게 돌아간다.
    return this.restaurants.find();
  }

  createRestaurant(
    createRestaurantDto: CreateRestaurantDto,
  ): Promise<Restaurant> {
    const newRestaurant = this.restaurants.create(createRestaurantDto);
    // DB에 저장하고싶다면 save method를 사용
    return this.restaurants.save(newRestaurant);
  }

  updateRestaurant({ id, data }: UpdateRestaurantDto) {
    return this.restaurants.update(id, { ...data });
  }
}
