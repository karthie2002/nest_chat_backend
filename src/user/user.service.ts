import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  //Signin new user - user/signupUser
  async signUpUser(createUserDto: CreateUserDto) {
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

  // ! last received msg to be added
  //Get all users (for homepage display) - user/fetchAllUsers
  async fetchAllUsers() {
    const fetchUsers = await this.prismaService.user.findMany({
      select: {
        username: true,
        id: true,
        messages: {
          select: {
            createdAt: true,
            content: true,
            groupId: true,
          },
        },
      },
    });
    return fetchUsers;
  }

  //Signin existing user - user/signinUser
  async signInUser(user: CreateUserDto) {
    try {
      const userData = await this.prismaService.user.findUniqueOrThrow({
        where: {
          username: user.username,
        },
        select: {
          username: true,
          id: true,
          createdAt: true,
          password: true,
        },
      });
      if (userData.password == user.password) {
        return {
          verified: true,
          userId: userData.id,
          username: userData.username,
          createdAt: userData.createdAt,
        };
      } else {
        throw new HttpException('Unauthorised', HttpStatus.UNAUTHORIZED);
      }
    } catch (error) {
      if (error instanceof HttpException) {
        if (error.getStatus() == HttpStatus.UNAUTHORIZED) {
          throw new HttpException(
            [
              { verified: false },
              {
                status: HttpStatus.UNAUTHORIZED,
                message: ['Login failed'],
              },
            ],
            HttpStatus.UNAUTHORIZED,
          );
        }
      }
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new HttpException(
            {
              statusCode: HttpStatus.FORBIDDEN,
              verified: false,
              message: ['Username invalid'],
            },
            HttpStatus.FORBIDDEN,
          );
        }
      }
    }
  }
}
