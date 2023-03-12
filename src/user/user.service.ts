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
      return {
        verified: true,
        userId: newUserData.id,
        username: newUserData.username,
        createdAt: newUserData.createdAt,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new HttpException(
            {
              statusCode: HttpStatus.NOT_FOUND,
              verified: false,
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
  async fetchAllUsers(userId: string) {
    const fetchUsers = await this.prismaService.user.findMany({
      where: {
        NOT: {
          id: { equals: userId },
        },
      },
      select: {
        username: true,
        id: true,
        createdAt: true,
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
            {
              statusCode: HttpStatus.UNAUTHORIZED,
              verified: false,
              message: ['Login failed'],
            },
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
