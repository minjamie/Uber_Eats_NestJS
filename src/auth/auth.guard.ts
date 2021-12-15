import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { JwtService } from 'src/jwt/jwt.service';
import { User } from 'src/users/entities/user.entity';
import { UsersService } from 'src/users/user.service';
import { AllowedRoles } from './role.decorator';

@Injectable()
// 인증 가드에 metadata를 넣는다.
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}
  // 메타데이터를 get 위해선 reflector class를 get해야한다.
  // 여기서 우리가 원하는 key, AllowedRoles를 get할 수 있고 target으로 context.getHandler()가 들어간다.
  // CanActivate는 함수로 request를 진행시키고 false를 request 멈추게한다.
  // 이 함수는 execution context라는 걸 사용하여 이것이 request context에 접근할 수 있게한다.
  //reflector는 metadata를 get한다.
  async canActivate(context: ExecutionContext) {
    // 가드는 오직 한가지 기능만 한다. true면 리퀘스트 진행이 허용 false면 진행되지 않는다.
    const roles = this.reflector.get<AllowedRoles>(
      'roles',
      context.getHandler(),
    );
    // 롤이 없다면 가드는 그냥 지나가라한다. 즉 누구나 쓸 수 있는 리졸버이라는 의미
    // 계정 생성 같은 public의 경우
    if (!roles) return true;
    // graphQL Context와 http context는 다르다
    // 그게 아니라면 컨텍스트를 얻는다.
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const token = gqlContext.token;
    console.log(token);
    // 컨텍스트에 토큰이 있으면 디코드해서 유저를 찾고
    if (token) {
      const decoded = this.jwtService.verify(token.toString());
      if (typeof decoded === 'object' && decoded.hasOwnProperty('id')) {
        const { user } = await this.usersService.findById(decoded['id']);
        if (!user) return false;
        gqlContext['user'] = user;
        //user가 어떻게 나오던 간에 가드가 Authuser 데코레이터보다 먼저 호출되기 때문에 guard는 user를 그래프큐엘 콘텍스트에 추가하고
        // 메타데이터도 있고 로그인한 유저도 있고 any도있으면 모든 사람 접근 가능
        if (roles.includes('Any')) return true;
        return roles.includes(user.role);
      } else {
        return false;
      }
      // 리졸버에 메타데이터가 있으면 유저가 로그인한 것 반대로 없으면 유저의 유효한 토큰 없는 경우
    } else {
      return false;
    }
  }
}
