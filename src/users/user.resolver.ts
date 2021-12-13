import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthUser } from 'src/auth/auth-user.decorater';
import { AuthGuard } from 'src/auth/auth.guard';
import { Role } from 'src/auth/role.decorator';
import {
  CreateAccountInput,
  CreateAccountOutput,
} from './dtos/create-account.dto';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { UserProfileInput, UserProfileOutput } from './dtos/user-profile.dto';
import { VerifyEmailInput, VerifyEmailOutput } from './dtos/verify-email.dto';
import { User } from './entities/user.entity';
import { UsersService } from './user.service';

// resolver는 문지기 역할, input을 받아가 input을 올바른 service로 전달해준다.
@Resolver((of) => User)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}
  @Query((returns) => User)
  @Role(['Any'])
  // 메타데이터가 설정되어있다.
  me(@AuthUser() authUser: User) {
    return authUser;
    // 데코레이터는 밸류를 리턴해야만 한다.
    // context자체를 통째로 넘기는 건 별로 좋지 않은 모습
  }

  @Query((returns) => UserProfileOutput)
  @Role(['Any'])
  async userProfile(
    @Args() userProfileInput: UserProfileInput,
  ): Promise<UserProfileOutput> {
    return this.usersService.findById(userProfileInput.userId);
  }
  @UseGuards(AuthGuard)
  @Mutation((returns) => EditProfileOutput)
  async editProfile(
    @AuthUser() authUser: User,
    @Args('input') editProfileInput: EditProfileInput,
  ): Promise<EditProfileOutput> {
    return this.usersService.editProfile(authUser.id, editProfileInput);
  }

  // createAccount 경우 어떠한 메타데이터도 설정되어있지않다.
  //  public resolver이기 때문에
  @Mutation((returns) => CreateAccountOutput)
  // @Role(['Delivery'])
  // 이렇게 리졸버에 메타데이터를 설정해놓으면 가드에 접근할 수 있다,.
  async createAccount(
    @Args('input') createAccountInput: CreateAccountInput,
  ): Promise<CreateAccountOutput> {
    return this.usersService.createAccount(createAccountInput);
  }

  @Mutation((returns) => LoginOutput)
  async login(@Args('input') loginInput: LoginInput): Promise<LoginOutput> {
    return this.usersService.login(loginInput);
  }

  @Mutation((returns) => VerifyEmailOutput)
  verifyEmail(@Args('input') { code }: VerifyEmailInput) {
    // 비동기 함수로 브라우저가 func이 끝나길 기다려준다.
    return this.usersService.verifyEmail(code);
  }
}
// 메타데이터를 설정한다는 건 authentication을 고려한다는 것을 의미한다.
// 유저가 인증되기를 원하고 그 후 유저의 롤을 확인해야한다.
// 메타데이터를 설정하지 않는 건 로그인 여부에 관심이 없다는 것이고 그 뜻은 퍼블릭 리졸버라는 것
