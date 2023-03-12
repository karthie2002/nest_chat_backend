import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserOnlineDto } from './dto/user-online.dto';

@Injectable()
export class ConnectionService {
  constructor(private readonly prismaService: PrismaService) {}

  async UserOnline(userOn: UserOnlineDto) {
    try {
      const UserOnlineInfo = await this.prismaService.user.update({
        where: {
          id: userOn.userId,
        },
        data: {
          online: true,
        },
        select: {
          group: {
            select: {
              id: true,
              user: {
                select: {
                  online: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      return UserOnlineInfo;
    } catch (error) {
      throw error;
    }
  }
  async UserOffline(userOn: UserOnlineDto) {
    try {
      const UserOfflineInfo = await this.prismaService.user.update({
        where: {
          id: userOn.userId,
        },
        data: {
          online: false,
        },
        select: {
          group: {
            select: {
              id: true,
              user: {
                select: {
                  online: true,
                  id: true,
                },
              },
            },
          },
        },
      });
      return UserOfflineInfo;
    } catch (error) {
      throw error;
    }
  }
}
