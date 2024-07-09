import { UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private readonly user: Repository<User>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: 'codemobiles5555',
    });
  }

  async validate(payload) {
    const { username = '' } = payload;
    const user = await this.user.findOne({
      where: {
        username,
      },
    });
    if (!user) {
      throw new UnauthorizedException();
    }
    return { username: user.username };
  }
}
