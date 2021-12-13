import { v4 as uuidv4 } from 'uuid';
import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { CoreEntity } from 'src/common/entities/core.entity';
import { BeforeInsert, Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { User } from './user.entity';

@InputType({ isAbstract: true })
@ObjectType()
@Entity()
export class Verification extends CoreEntity {
  @Column()
  @Field((type) => String)
  code: string;
  // Varification가 오직 한명의 User를 포함 반대도 마찬가지

  //유저가 삭제되었을 때 동작을 정의 onDelete,
  // 옵션 1. CASCADE -usre 삭제시 user와 붙어있는 varification도 같이 삭제
  @OneToOne((type) => User, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: User;

  @BeforeInsert()
  createCode(): void {
    this.code = uuidv4();
  }
}
