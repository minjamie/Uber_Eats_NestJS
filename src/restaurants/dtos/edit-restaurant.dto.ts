import { Field, InputType, ObjectType, PartialType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { CreateRestaurantInput } from './create-restaurant.dto';

@InputType()
// partial type은 클래스의 모든 프로퍼티를 가져와서 옵셔널 취급을 한다.
//  pick type은 원하는 클래스 프로퍼티를 가져온다.
// PartialType(PickType(Restaurant, ['address', 'name', 'coverImg'])),
export class EditRestaurantInput extends PartialType(CreateRestaurantInput) {
  @Field((type) => Number)
  restaurantId: number;
}

@ObjectType()
export class EditRestaurantOutput extends CoreOutput {}
