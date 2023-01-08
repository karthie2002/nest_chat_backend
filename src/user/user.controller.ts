import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signupUser')
  async signUpUser(@Body() user: CreateUserDto) {
    return await this.userService.signUpUser(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signinUser')
  async signInUser(@Body() user: CreateUserDto) {
    return await this.userService.signInUser(user);
  }

  @Get('fetchAllUsers')
  async fetchAllUsers() {
    return await this.userService.fetchAllUsers();
  }
}
