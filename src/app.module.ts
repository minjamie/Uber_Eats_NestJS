import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import * as Joi from 'joi';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { User } from './users/entities/user.entity';
import { Verification } from './users/entities/verification.entity';
import { JwtModule } from './jwt/jwt.module';
import { JwtMiddleWare } from './jwt/jwt.middleware';
import { MailModule } from './mail/mail.module';
import { Restaurant } from './restaurants/entities/restaurant.entity';
import { Category } from './restaurants/entities/category.entity';
import { RestaurantsModule } from './restaurants/restaurants.module';
import { AuthModule } from './auth/auth.module';
import { Dish } from './restaurants/entities/dish.entity';
import { OrdersModule } from './orders/orders.module';
import { Order } from './orders/entities/order.entity';
import { OrderItem } from './orders/entities/order-item';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: process.env.NODE_ENV === 'dev' ? '.env.dev' : '.env.test',
      ignoreEnvFile: process.env.NODE_ENV === 'prod',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string().valid('dev', 'prod').required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        PRIVATE_KET: Joi.string().required(),
        MAILGUN_API_KEY: Joi.string().required(),
        MAILGUN_DOMAIN_NAME: Joi.string().required(),
        MAILGUN_FROM_EMAIL: Joi.string().required(),
      }),
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: true,
      // req user를 graphql resolver의 context를 통해 공유
      context: ({ req }) => ({ user: req['user'] }),
      // headers에서 user를 req에 보내는 middleware까지 구현
      // apollo server, graphql 은 context를 가진다.
      // req context 는 각 req에서 사용 가능하며
      // context가 함수로 정의되면 매 req마다 호출
      // req property를 포함한 obj를 express로 부터 받는다
      // 즉 context에 property를 넣으면 이 프로퍼티는 resolver안에서 확인 가능하다.
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: +process.env.DB_PORT,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      synchronize: process.env.NODE_ENV !== 'prod',
      logging: false,
      entities: [
        Verification,
        User,
        Restaurant,
        Category,
        Dish,
        Order,
        OrderItem,
      ],
    }),
    JwtModule.forRoot({
      privateKey: process.env.PRIVATE_KET,
    }),
    // static module은 이 JwtModule처럼 어떠한 설정도 적용되어 있지 않는다.
    // dynamic module은 GraphQLModule처럼 설정이 존재
    // 동적인 모듈은 결과적으로 정적인 모듈이 된다.
    MailModule.forRoot({
      apiKey: process.env.MAILGUN_API_KEY,
      fromEmail: process.env.MAILGUN_DOMAIN_NAME,
      domain: process.env.MAILGUN_FROM_EMAIL,
    }),
    UsersModule,
    MailModule,
    RestaurantsModule,
    AuthModule,
    OrdersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  // 모든 app에서 미들웨어를 사용하도록
  // NextModule 상속
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleWare).forRoutes({
      //forRoutes()를 통해 /graphql 경로에 method가 POST 경우에만 apply 적용한다는 것
      path: '/graphql',
      method: RequestMethod.POST,
      // path: '*',method:RequestMethod.ALL - 모든 경로 모든 메소드
      // consumer.apply(JwtMiddleWare).exclude// 특정 경로 제외하고 적용
    });
    // 어떤 라우터에서 동작하는지 설정할 수 있음
  }
}
