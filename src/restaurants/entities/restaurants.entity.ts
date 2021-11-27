import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
// graphql 로부터 ObjectType import 받기
export class Restaurants {
  // 그래프 큐엘 관점에서 본 Restaurants 어떻게 생겼는지 작성하기
  @Field((type) => String)
  // 필드 데코레이터 역시 리턴타입함수를 인자로 받는다.
  name: string;

  @Field((type) => Boolean, { nullable: true })
  isVegan?: boolean;

  @Field((type) => String)
  address: string;

  @Field((type) => String)
  ownerName: string;
}

// 이러한 형태가 Restaurant을 위한 ObjectType을 생성해준다.
// 데이터베이스의 모델을 만든 과정이다.
