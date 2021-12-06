import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAccountInput } from './dtos/create-account.dto';
import { LoginInput, LoginOutput } from './dtos/login.dto';
import { User } from './entities/user.entitiy';
import { JwtService } from 'src/jwt/jwt.service';
import { ConfigService } from '@nestjs/config';
import { EditProfileInput, EditProfileOutput } from './dtos/edit-profile.dto';
import { emit } from 'process';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private readonly users: Repository<User>,
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
      await this.users.save(this.users.create({ email, password, role }));
      // DB에 저장 되기 이전에 이미 Instance를 갖고 있음
      // 주의할 건 create는 단순히 entity를 생성하기만 할 뿐 저장하는 건 아니다

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
      const user = await this.users.findOne({ email });
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
    }
    if (password) {
      user.password = password;
    }
    this.users.save(user);
  }
}
