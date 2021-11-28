import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { Column, Entity, PrimaryColumn, PrimaryGeneratedColumn } from 'typeorm';

// 옵션 1번 혹은 @InputType({ isAbstract: true }),
// isAbstract 어떤것으로 확장하는 다는 것을 의미, 스키마에 이 InputType이 포함되지 않게된다.
// @InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant {
  @PrimaryGeneratedColumn()
  @Field((type) => Number)
  id: number;

  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => Boolean, { defaultValue: true })
  @Column()
  @IsBoolean()
  @IsOptional()
  isVegan?: boolean;

  @Field((type) => String, { defaultValue: '강남' })
  @Column()
  @IsString()
  @Length(5)
  @IsOptional()
  address: string;
}

// 이러한 형태가 Restaurant을 위한 ObjectType을 생성해준다.
// 데이터베이스의 모델을 만든 과정이다.
