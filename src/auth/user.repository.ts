import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { UserCredentialDto } from './dto/user-credential.dto';
import * as bcrypt from 'bcrypt';
@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(userCredentialDto: UserCredentialDto) {
    const { username = '', password = '' } = userCredentialDto;
    const salt = bcrypt.genSaltSync();
    const user = new User();
    user.username = username;
    user.salt = salt;
    user.password = await this.hashPassword(password, salt);
    try {
      await user.save();
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(
          'Error, because this username already exist!',
        );
      } else {
        throw new InternalServerErrorException();
      }
    }

    return user;
  }

  async verifyUserPassword(userCredentialDto: UserCredentialDto) {
    const { username, password } = userCredentialDto;
    const user = await this.userRepository.findOne({ where: { username } });
    if (user && (await user.verifyPassowrd(password))) {
      return user.username;
    } else {
      return null;
    }
  }

  async hashPassword(password: string, salt: string) {
    return await bcrypt.hash(password, salt);
  }

  async findOneUser(username: string) {
    return await this.userRepository.findOne({ where: { username } });
  }
}
