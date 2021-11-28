import { ArgsType, Field, InputType, OmitType } from '@nestjs/graphql';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

@InputType()
export class CreateRestaurantDto extends OmitType(
  Restaurant,
  ['id'],
  InputType,
) {
  // Parent type과 child type이 다른 경우
  // 옵션 2번
  // 레스토랑에 있는 오브젝트 타입이므로 결과로 나 오는 클래스도 오브젝트 타입이되기때문에
  // 두번째 인자로 InputType을 전해준다.
}
