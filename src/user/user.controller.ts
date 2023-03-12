import {
  Controller,
  Post,
  Body,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UserOnlineDto } from '../connection/dto/user-online.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signupUser')
  async signUpUser(@Body() user: CreateUserDto) {
    return await this.userService.signUpUser(user);
  }

  @HttpCode(HttpStatus.OK)
  @Post('signinUser')
  async signInUser(@Body() user: CreateUserDto) {
    return await this.userService.signInUser(user);
  }

  @Get('fetchAllUsers/:id')
  async fetchAllUsers(@Param('id') userId: string) {
    return await this.userService.fetchAllUsers(userId);
  }
}
