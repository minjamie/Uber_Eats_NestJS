import {
  Field,
  InputType,
  ObjectType,
  OmitType,
  PickType,
} from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@InputType()
export class CreateRestaurantInput extends PickType(
  Restaurant,
  ['name', 'coverImg', 'address'],
  InputType,
) {
  @Field((type) => String)
  categoryName: string;
}

//category와 User를 가진 레스토랑 생성할 수 있기에 제외시켜야한다.
@ObjectType()
export class CreateRestaurantOutput extends CoreOutput {
  restaurantId?: number;
}
