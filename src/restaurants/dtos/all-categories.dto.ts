import { Field, ObjectType } from '@nestjs/graphql';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { Category } from '../entities/category.entity';

@ObjectType()
export class AllCategoriesOutput extends CoreOutput {
  @Field((type) => [Category], { nullable: true })
  categories?: Category[];
}