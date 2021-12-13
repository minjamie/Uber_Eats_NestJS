import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';
import { UsersService } from 'src/users/user.service';
import { JwtService } from './jwt.service';

//  클래스로 만드는 방법
@Injectable()
// @Injectable()해야 dependency injection이 가능하다
export class JwtMiddleWare implements NestMiddleware {
  // implements와 extends 차이
  // implements는 interface, class가 마치 interface처럼 행동해야하는 것
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    //headers에서 유저를 찾아 req에 보내는 미들웨어와 dependency injection을 이용
    if ('x-jwt' in req.headers) {
      const token = req.headers['x-jwt'];
      try {
        const decoded = this.jwtService.verify(token.toString());
        if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
          const { user, ok } = await this.usersService.findById(decoded['id']);
          if (ok) {
            req['user'] = user;
          }
        }
      } catch (error) {}
    }
    next();
  }
}

// 함수로  만드는 방법
// export function JwtMiddleWare(req: Request, res: Response, next: NextFunction) {
//   next();
// }
