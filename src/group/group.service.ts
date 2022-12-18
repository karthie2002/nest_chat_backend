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
      console.log('throw me');
      throw new WsException('Group name already exists');

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
        } else {
          throw error;
        }
      } else {
        throw error;
      }
    }
  }

  async findGroup(fetchGroup: FetchGroupDto) {
    return await this.prismaService.user.findMany({
      select: {
        id: true,
      },
      where: {
        id: {
          notIn: fetchGroup.userIds,
        },
      },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} group`;
  }
}
