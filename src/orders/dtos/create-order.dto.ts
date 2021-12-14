import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { OrderItemOption } from '../entities/order-item';

//  1. order에서 dish를 가지고 있었고 dish는 유저가 고른 options도 필요하다
//  2. 따라서 orderItem을 만들어서 options를 저장해준다
@InputType()
export class CreateOrderItemInput {
  @Field((type) => Int)
  dishId: number;

  @Field((type) => [OrderItemOption], { nullable: true })
  options?: OrderItemOption[];
}

// picktype을 사용하지 않는 이유는 orderItem전체를 input으로 하기 싫어서
@InputType()
export class CreateOrderInput {
  @Field((type) => Int)
  restaurantId: number;

  @Field((type) => [CreateOrderItemInput])
  items: CreateOrderItemInput[];
}

@ObjectType()
export class CreateOrderOutput extends CoreOutput {}
