import { Module } from '@nestjs/common';
import * as Joi from 'joi';
// 자바스크립트 패키지는 타입스크립트로 만들어있지 않기때문에 import하는 방식이 다름
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      // 어플리케이션 어디서나 config 모듈 접근 가능하도록
      isGlobal: true,
      // 변수를 환경에 따라 다르게 접근 하도록 설정
      // npm 환경에 따라 다르게 실행되도록 pagkage.json script수정
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      // 서버에 배포할 때 환경 변수 파일 사용하지 않도록
      // prod 환경일 때 ConfigModule은 환경변수 파일을 무시함
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      // import한 Joi object활용하여 환경 변수마저 유효성 검사를 할 수 있다.
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),

        // Joi는 string이 되어야하며 valid안에 환경 변수들을 적어준다.
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
    }),
    //1.  typeorm 모듈 앱 모듈에 설치
    TypeOrmModule.forRoot({
      //connection Option, 1, 코드에 직접쓰거나 2. ormconfig.json파일에 쓰는법
      entities: [Restaurant],
      type: 'postgres',
      host: process.env.DB_HOST,
      // 숫자가 들어간 string("252")을 num으로 바꾸기 위해서+를 앞에 붙여주면됨
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      // prod 아니면 synchronize가 true
      // 데이터 베이스에서 모듈의 현재상태로 마이크레이션
      logging: true,
      // 로깅을 찍어준다.
    }),
    RestaurantsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
