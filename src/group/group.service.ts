import { Injectable } from '@nestjs/common';
import { CreateGroupDto, FetchGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';

interface ConnectUser {
  id: string;
}

@Injectable()
export class GroupService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  //Create a new group - group/createGroup
  async createGroup(group: CreateGroupDto) {
    const sorted = [...group.userIds].sort();
    let connectUser: ConnectUser[] = [];
    sorted.forEach((each: string) => {
      connectUser.push({ id: each });
    });
    try {
      const groupData = await this.prismaService.group.create({
        data: {
          userIds: group.userIds,
          groupName: group.name,
          user: {
            connect: connectUser,
          },
          userJson: sorted.reduce(function (result, item, index) {
            result[`user${index + 1}`] = item;
            return result;
          }, {}),
        },
      });
      return { created: true, groupData };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (
          error.code === 'P2002' &&
          error.meta.target == 'Group_userJson_key'
        ) {
          throw new WsException(
            'Cannot form multiple groups with the same users',
          );
        } else if (error.code === 'P2002') {
          throw new WsException('Group name already exists');
        } else if (error.code === 'P2022') {
          throw new WsException('Invalid command');
        } else {
          throw new WsException('Invalid user');
        }
      } else {
        throw error;
      }
    }
  }

  //Return a group details - group/findGroup
  async findGroup(fetchGroup: FetchGroupDto) {
    const groupData = await this.prismaService.group.findUniqueOrThrow({
      where: {
        id: fetchGroup.id,
      },
      select: {
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        createdAt: true,
        description: true,
      },
    });

    return {
      groupData,
    };
  }
}
