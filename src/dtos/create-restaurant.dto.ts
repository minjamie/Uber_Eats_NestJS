import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { IsBoolean, IsString, Length } from 'class-validator';

@ArgsType()
export class CreateRestaurantDto {
  @Field((type) => String)
  @IsString()
  @Length(5, 10)
  name: string;

  @Field((type) => Boolean)
  @IsBoolean()
  isVegan: boolean;

  @IsString()
  @Field((type) => String)
  address: string;

  @IsString()
  @Length(5, 10)
  @Field((type) => String)
  ownerAName: string;
}
