import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  // 여기선 오직 function component만 사용가능
  // app.use(JwtMiddleWare);
  // bootstrap에서 전제 어플리케이션 사용가능하도록 할 수 도 있음
  await app.listen(3000);
}
bootstrap();
