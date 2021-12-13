import {
  Field,
  InputType,
  ObjectType,
  registerEnumType,
} from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, BeforeUpdate, Column, Entity, OneToMany } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { InternalServerErrorException } from '@nestjs/common';
import { IsBoolean, IsEmail, IsEnum, IsString } from 'class-validator';
import { Restaurant } from 'src/restaurants/entities/restaurant.entity';

export enum UserRole {
  Client = 'Client',
  Owner = 'Owner',
  Delivery = 'Delivery',
}
// graphGLd enum을 만드는 법
registerEnumType(UserRole, { name: 'UserRole' });

//ObjectType과 InputType이 같은 이름을 사용해선 안됌
@InputType('UserInputType', { isAbstract: true })
@ObjectType()
@Entity()
export class User extends CoreEntity {
  // 1. User graphGL Object 생성
  @Column()
  @Field((type) => String)
  @IsEmail()
  email: string;

  // 첫 번쩨 파트 . select false를 하면 user에 더이상 psw가 포함이 안됨
  //  select false는 this.psw가 정의 x 따라서 psw를 사용하려면 psw select하고 싶다고 전달해야함
  @Column({ select: false })
  @Field((type) => String)
  @IsString()
  password: string;

  @Column({ type: 'enum', enum: UserRole })
  @Field((type) => UserRole)
  @IsEnum(UserRole)
  role: UserRole;

  @Column({ default: false })
  @Field((type) => Boolean)
  @IsBoolean()
  verified: boolean;

  @Field((type) => [Restaurant])
  @OneToMany((type) => Restaurant, (restaurant) => restaurant.owner)
  restaurant: Restaurant[];

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword(): Promise<void> {
    try {
      // 2번째 파트. psw가 있을 경우에만 해쉬화 진행
      if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
      }
      // DB에 저장하기 전 여기 instance의 password를 받아서 해쉬화함
    } catch (e) {
      console.log(e);
      throw new InternalServerErrorException();
    }
  }

  async checkPassword(aPassword: string): Promise<boolean> {
    try {
      const ok = await bcrypt.compare(aPassword, this.password);
      return ok;
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException();
    }
  }
}
