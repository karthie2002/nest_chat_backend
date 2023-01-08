import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { FetchAllMessagesDto } from './dto/fetch-chat.dto';
import { DeleteMessageDto } from './dto/delete-chat.dto';
import { UpdateMessageDto } from './dto/update-chat.dto';
@Injectable()
export class ChatService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  //Sending a new message to a group(room) - chatToServer
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
        groupId: true,
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

  //Fetches all the messages in a group(room) - fetchAllMessages
  async fetchAllMessages(fetchAllMessagesDto: FetchAllMessagesDto) {
    const messages = await this.prismaService.message.findMany({
      where: {
        groupId: fetchAllMessagesDto.groupId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        content: true,
        createdAt: true,
        user: {
          select: {
            id: true,
            username: true,
          },
        },
        msgRead: true,
      },
    });
    return messages;
  }

  async updateMessage(updateChatDto: UpdateMessageDto) {
    return await this.prismaService;
  }

  //Delete a message - deleteMessage
  async deleteMessage(message: DeleteMessageDto) {
    await this.prismaService.message.delete({
      where: {
        id: message.messageId,
      },
    });
  }
}
