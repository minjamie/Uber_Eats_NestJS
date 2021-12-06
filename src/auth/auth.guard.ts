import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthGuard implements CanActivate {
  // CanActivate는 함수로 request를 진행시키고 false를 request 멈추게한다.
  // 이 함수는 execution context라는 걸 사용하여 이것이 request context에 접근할 수 있게한다.
  canActivate(context: ExecutionContext) {
    // graphQL Context와 http context는 다르다
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const user = gqlContext['user'];
    if (!user) {
      return false;
    }
    return true;
  }
}
