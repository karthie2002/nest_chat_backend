import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}
  async signUp(createUserDto: CreateUserDto) {
    try {
      const newUserData = await this.prismaService.user.create({
        data: {
          username: createUserDto.username,
          password: createUserDto.password,
        },
      });
      return { created: true, newUserData };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            {
              status: HttpStatus.NOT_FOUND,
              message: ['User already exists'],
            },
            HttpStatus.NOT_FOUND,
          );
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async fetchAllUsers() {
    const fetchUsers = await this.prismaService.user.findMany({
      select: {
        username: true,
        id: true,
      },
    });

    return fetchUsers;
  }

  async signIn(user: CreateUserDto) {
    try {
      const userData = await this.prismaService.user.findUniqueOrThrow({
        where: {
          username: user.username,
        },
      });
      if (userData.password == user.password) {
        return { verified: true };
      } else {
        return { verified: false };
      }
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            {
              status: HttpStatus.FORBIDDEN,
              message: ['Login Failed'],
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }
  }
}
