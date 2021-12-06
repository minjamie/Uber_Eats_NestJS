import { Field, ObjectType } from '@nestjs/graphql';

// 두 군 데 다 ObjectType 데코레이터를 넣어줄 것
@ObjectType()
export class CoreOutput {
  @Field((type) => String, { nullable: true })
  error?: string;
  @Field((type) => Boolean)
  ok: boolean;
}
