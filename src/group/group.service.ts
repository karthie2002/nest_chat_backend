import { Injectable } from '@nestjs/common';
import { CreateGroupDto } from './dto/create-group.dto';
import { FetchGroupDto } from './dto/fetch-group.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';

interface ConnectUser {
  id: string;
}

// const W3CWebSocket = require('websocket').w3cwebsocket;
// const WebSocketAsPromised = require('websocket-as-promised');

// const wsp = new WebSocketAsPromised('http://localhost:3000', {
//   createWebSocket: (url: any) => new W3CWebSocket(url),
// });

// wsp
//   .open()
//   .then(() => wsp.send('foo'))
//   .then(() => wsp.close())
//   .catch((e: any) => console.error(e));

@Injectable()
export class GroupService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}
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

  async findGroup(fetchGroup: FetchGroupDto) {
    const groupData = await this.prismaService.group.findUniqueOrThrow({
      where: {
        id: fetchGroup.id,
      },
      select: {
        createdAt: true,
        description: true,
        userIds: true,
      },
    });
    const userData = await this.prismaService.user.findMany({
      where: {
        id: {
          in: groupData.userIds,
        },
      },
      select: {
        username: true,
        id:true,
      },
    });
    return {
      userData,
      groupData: {
        createdAt: groupData.createdAt,
        description: groupData.description,
      },
    };
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} group`;
  // }
}
