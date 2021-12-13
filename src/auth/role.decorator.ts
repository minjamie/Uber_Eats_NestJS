import { SetMetadata } from '@nestjs/common';
import { any } from 'joi';
import { UserRole } from 'src/users/entities/user.entity';
// 이 데코레이터는 메타테이터(리졸버의 extar data) 를 설정해준다.
export type AllowedRoles = keyof typeof UserRole | 'Any';
export const Role = (roles: AllowedRoles[]) => SetMetadata('roles', roles);
// 데코레이터를 리턴하는 데코레이터 생성
// roles 배열이 roles 메타데이터 키에 저장된다.
