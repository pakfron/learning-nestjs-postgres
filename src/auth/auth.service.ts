import { JwtService } from '@nestjs/jwt';
import { UserCredentialDto } from './dto/user-credential.dto';
import { UserRepository } from './user.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}

  async signUp(userCredentialDto: UserCredentialDto) {
    return await this.userRepository.createUser(userCredentialDto);
  }

  async signIn(userCredentialDto: UserCredentialDto) {
    const username =
      await this.userRepository.verifyUserPassword(userCredentialDto);
    if (!username) {
      throw new UnauthorizedException('Invalid username or password');
    }

    const payload = { username };
    const token = await this.jwtService.sign(payload);

    return { token };
  }
}
