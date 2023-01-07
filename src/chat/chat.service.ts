import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';
@Injectable()
export class ChatService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  async createMessage(message: CreateChatDto) {
    const messageData = await this.prismaService.message.create({
      data: {
        content: message.content,
        msgRead: false,
        group: {
          connect: {
            id: message.groupId,
          },
        },
        user: {
          connect: {
            id: message.userId,
          },
        },
      },
      select: {
        content: true,
        createdAt: true,
        msgRead: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
      },
    });
    return messageData;
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
