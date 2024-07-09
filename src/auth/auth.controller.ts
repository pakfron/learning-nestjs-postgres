import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserCredentialDto } from './dto/user-credential.dto';
import { AuthGuard } from '@nestjs/passport';
import { GetUserName } from './get-username.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authenService: AuthService) {}
  // { "username": "admin", "password": "Tt12345678*" }
  @Post('/signup')
  @UsePipes(ValidationPipe)
  signUp(@Body() userCredential: UserCredentialDto) {
    return this.authenService.signUp(userCredential);
  }

  @Post('/signin')
  signIn(@Body() userCredential: UserCredentialDto) {
    return this.authenService.signIn(userCredential);
  }

  @Get('/test')
  @UseGuards(AuthGuard())
  test(@Req() req, @GetUserName() username) {
    // return req.user;
    return username;
  }
}
