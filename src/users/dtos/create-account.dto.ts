import { Field, InputType, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { User } from '../entities/user.entity';

@InputType()
export class CreateAccountInput extends PickType(User, [
  'email',
  'password',
  'role',
]) {
  // PickType은 class를 가지며 User와 가지고 싶을 걸 고를 수 있다
}

// 두 군 데 다 ObjectType 데코레이터를 넣어줄 것
@ObjectType()
export class CreateAccountOutput extends CoreOutput {}
