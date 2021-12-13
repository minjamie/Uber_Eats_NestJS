import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsBoolean, IsOptional, IsString, Length } from 'class-validator';
import { CoreOutput } from 'src/common/dtos/output.dtd';
import { CoreEntity } from 'src/common/entities/core.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Category } from './category.entity';
@InputType('RestaurantInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class Restaurant extends CoreEntity {
  @Field((type) => String)
  @Column()
  @IsString()
  @Length(5)
  name: string;

  @Field((type) => String)
  @Column()
  @IsString()
  coverImg: string;

  @Field((type) => String)
  @Column()
  @IsString()
  address: string;

  @Field((type) => Category, { nullable: true })
  // nullable을 추가하는 이유는 category를 지울 때 restaurant을 지우면 안되기 때문
  @ManyToOne((type) => Category, (category) => category.restaurant, {
    nullable: true,
    onDelete: 'SET NULL',
  })
  category: Category;

  @Field((type) => User)
  // nullable을 추가하는 이유는 category를 지울 때 restaurant을 지우면 안되기 때문
  @ManyToOne((type) => User, (user) => user.restaurant, {
    onDelete: 'CASCADE',
  })
  owner: User;
  // 어떤 relationId를 로드할 건지 리턴값으로 넘겨준다
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;
}
