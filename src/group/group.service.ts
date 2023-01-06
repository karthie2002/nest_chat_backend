import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { FetchAllGroupsDto, FetchOneGroupDto } from './dto/fetch-group.dto';

interface ConnectUser {
  id: string;
}

@Injectable()
export class GroupService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  //Create a new group - createGroup
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

  //!Last received msg
  //All groups in which user exists - fetchAllGroups
  async fetchAllGroups(userId: FetchAllGroupsDto) {
    const groups = await this.prismaService.group.findMany({
      where: {
        userIds: {
          has: userId.userId,
        },
      },
      select: {
        id: true,
        groupName: true,
        messageId: {
          select: {
            createdAt: true,
            content: true,
            groupId: true,
          },
        },
      },
    });
    console.log(groups);
    return groups;
  }

  async fetchOneGroup(body: FetchOneGroupDto) {
    const groupData = await this.prismaService.group.findUniqueOrThrow({
      where: {
        id: body.groupId,
      },
      select: {
        groupName: true,
        description: true,
        messageId: true,
        userIds: true,
      },
    });
    console.log(groupData);
    return groupData;
  }
}
