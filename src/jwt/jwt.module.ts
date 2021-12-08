import { DynamicModule, Global, Module } from '@nestjs/common';
import { JwtModuleOptions } from './jwt.interfaces';
import { CONFIG_OPTIONS } from '../common/common.contstants';
import { JwtService } from './jwt.service';

@Module({})
@Global()
export class JwtModule {
  static forRoot(options: JwtModuleOptions): DynamicModule {
    // option을 jwtService로 내보내는 방법에 대해서=> provider object활용
    // forRoot함수 구현, DynamicModule 값을 반환
    // 다른 모듈을 반환해주는 모듈
    return {
      // 모듈이 JwtService를 export하도록
      module: JwtModule,
      providers: [
        {
          // CONFIG_OPTIONS 이름을 가진 provider가 존재
          provide: CONFIG_OPTIONS,
          useValue: options,
          // value가 options이다.
        },
        JwtService,
      ],
      exports: [JwtService],
    };
  }
}
