import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput } from './dtos/login.dto';
import { User } from './entities/user.entity';
import { JwtService } from 'src/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { EditProfileInput } from './dtos/edit-profile.dto';
import { emit } from 'process';
import { Verification } from './entities/verification.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
    @InjectRepository(Verification)
    private readonly verifications: Repository<Verification>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}
  async createAccount({
    email,
    password,
    role,
  }: CreateAccountInput): Promise<{ ok: boolean; error?: string }> {
    try {
      // 1. 새로운 유저인 경우 새 계정 생성 & 암호 해쉬화
      // 새로운 유저인지 확인하기
      const exists = await this.users.findOne({ email });
      if (exists) {
        // 에러 생성
        return { ok: false, error: 'THere is a user with that email already' };
      }
      const user = await this.users.save(
        this.users.create({ email, password, role }),
      );
      // DB에 저장 되기 이전에 이미 Instance를 갖고 있음
      // 주의할 건 create는 단순히 entity를 생성하기만 할 뿐 저장하는 건 아니다

      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
      return { ok: true };
    } catch (error) {
      return { ok: false, error: "Couldn't create account" };
      // make error
    }
  }
  async login({
    email,
    password,
  }: LoginInput): Promise<{ ok: boolean; error?: string; token?: string }> {
    // make a jwt and give it to the user
    try {
      const user = await this.users.findOne(
        { email },
        { select: ['id', 'password'] },
        // 이렇게하면 this.psw를 사용가능
      );
      // find the user with the email
      if (!user) {
        return {
          ok: false,
          error: 'User not found',
        };
      }
      // check if the psw is correct
      const passwordCorrect = await user.checkPassword(password);
      if (!passwordCorrect) {
        return {
          ok: false,
          error: 'Wrong Password',
        };
      }
      // userid도한 select해줘야한다.
      const token = this.jwtService.sign(user.id);
      return {
        ok: true,
        token,
      };
      // 위에 선언해준 user와  user.checkPassword는 다르다
    } catch (error) {
      return {
        ok: false,
        error,
      };
    }
  }
  async findById(id: number): Promise<User> {
    return this.users.findOne({ id });
  }
  async editProfile(userId: number, { email, password }: EditProfileInput) {
    const user = await this.users.findOne(userId);
    if (emit) {
      user.email = email;
      user.verified = false;
      await this.verifications.save(
        this.verifications.create({
          user,
        }),
      );
    }
    if (password) {
      user.password = password;
    }
    this.users.save(user);
  }

  async verifyEmail(code: string): Promise<boolean> {
    try {
      const verification = await this.verifications.findOne(
        {
          code,
        },
        // 통째로 가져온다
        { relations: ['user'] },
        // user의 id만 받아온다
        // {loadRelationIds:true}
      );
      if (verification) {
        // 유저 인증 => 인증되면 인증서를 일고 => 인증 => 지워주기
        verification.user.verified = true;
        console.log(verification.user);
        //save를 한 번 더 하면 hash를 한 번 더 진행하여 비밀번호가 바뀌는 문제발생
        await this.users.save(verification.user);
        await this.verifications.delete(verification.id);
        return true;
        // 왜냐면 save는 user를 업데이트하고 beforeUpdate로 인해 해쉬화가된다
        // 해결 방식1 user출력할 때 마다 psw를 선택하지 않는것
      }
      return false;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
