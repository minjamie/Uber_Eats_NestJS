import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { IsString, Length } from 'class-validator';
import { CoreEntity } from 'src/common/entities/core.entity';
import { Order } from 'src/orders/entities/order.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, OneToMany, RelationId } from 'typeorm';
import { Category } from './category.entity';
import { Dish } from './dish.entity';
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

  @Field((type) => Order, { nullable: true })
  @OneToMany((type) => Order, (order) => order.restaurant)
  orders: Order[];

  // 어떤 relationId를 로드할 건지 리턴값으로 넘겨준다
  @RelationId((restaurant: Restaurant) => restaurant.owner)
  ownerId: number;

  @Field((type) => [Dish])
  // 1:N 관계가 Dish임을 첫번째 인자로 넘겨 알려주고
  // 2번째는 함수로 dish의 restaurant을 dish.restaurant에서 찾을 수 있음을 의미
  @OneToMany((type) => Dish, (dish) => dish.restaurant)
  menu: Dish[];
}
