import { Controller, Post, Body } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signupUser')
  signUp(@Body() user: CreateUserDto) {
    return this.userService.signUp(user);
  }

  @Post('signinUser')
  signIn(@Body() user: CreateUserDto){
    return this.userService.signIn(user);
  }

}
