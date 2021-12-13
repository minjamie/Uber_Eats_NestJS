import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { Category } from 'src/restaurants/entities/category.entity';
import { CoreOutput } from './output.dtd';

@InputType()
export class PaginationInput {
  @Field((type) => Int, { defaultValue: 1 })
  page: number;
}

@ObjectType()
export class PaginationOutput extends CoreOutput {
  @Field((type) => Int, { nullable: true })
  totalPage?: number;

  @Field((type) => Int, { nullable: true })
  totalResults?: number;
}
