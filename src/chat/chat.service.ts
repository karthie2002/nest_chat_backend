import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime';
import { WebSocketServer, WsException } from '@nestjs/websockets';
import { FetchAllMessagesDto } from './dto/fetch-chat.dto';
import { DeleteMessageDto } from './dto/delete-chat.dto';
import { UpdateMessageDto, MessageReadDto } from './dto/update-chat.dto';
import CryptoJS from 'crypto-js';

@Injectable()
export class ChatService {
  client: any;
  constructor(private readonly prismaService: PrismaService) {}

  //Sending a new message to a group(room) - chatToServer
  async createMessage(message: CreateChatDto) {
    try {
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
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new WsException('Message not sent!!');
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }

  //Fetches all the messages in a group(room) - fetchAllMessages
  async fetchAllMessages(fetchAllMessagesDto: FetchAllMessagesDto) {
    try {
      return await this.prismaService.$transaction(async (tx) => {
        // const readMessagesData = await tx.message.updateMany({
        //   where: {
        //     AND: [{ groupId: fetchAllMessagesDto.groupId }, { msgRead: false }],
        //   },
        //   data: {
        //     msgRead: true,
        //   },
        // });

        const readMessagesData = await tx.message.updateMany({
          where: {
            AND: [{ groupId: fetchAllMessagesDto.groupId }, { msgRead: false }],
            NOT: {
              userId: fetchAllMessagesDto.userId,
            },
          },
          data: {
            msgRead: true,
          },
        });
        const allMessages = await tx.message.findMany({
          take: 25,
          where: {
            groupId: fetchAllMessagesDto.groupId,
          },
          orderBy: {
            createdAt: 'desc',
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
        return { readMessagesData, allMessages };
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new WsException('Unable to fetch messages!!');
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }

  //Edit an already existing message - editMessage
  async updateMessage(updateChatDto: UpdateMessageDto) {
    try {
      const messageData = await this.prismaService.message.update({
        where: {
          id: updateChatDto.messageId,
        },
        data: {
          content: updateChatDto.updatedContent,
        },
        select: {
          content: true,
          createdAt: true,
          id: true,
          groupId: true,
          userId: true,
          msgRead: true,
        },
      });
      return messageData;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new WsException('Message not updated!!');
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }

  //Delete a message - deleteMessage
  async deleteMessage(message: DeleteMessageDto) {
    try {
      await this.prismaService.message.delete({
        where: {
          id: message.messageId,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new WsException('Message not deleted!!');
      } else {
        throw new WsException('Unknown error!!');
      }
    }
  }

  // async messageRead(messageReadDto: MessageReadDto) {
  //   return await this.prismaService;
  // }
  realEnc(message: string, groupId: string) {
    let plainText = message;
    let key = CryptoJS.enc.Utf8.parse(groupId);
    let iv = CryptoJS.enc.Base64.parse('AAAAAAAAAAAAAAAAAAAAAA==');
    console.log(plainText);
    console.log(key.toString(CryptoJS.enc.Base64));
    console.log(iv.toString(CryptoJS.enc.Base64));
    let encrypted = CryptoJS.AES.encrypt(plainText, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      // padding: CryptoJS.pad.Pkcs7,
    });
    return encrypted.toString();
  }
  async encryption() {
    const data = await this.prismaService.message.findMany({
      where: {
        groupId: '63f1bbb55eb1b2332baae13c',
      },
      select: {
        content: true,
        groupId: true,
        id: true,
      },
    });
    data.forEach(async (item) => {
      await this.prismaService.message.updateMany({
        where: {
          id: item.id,
        },
        data: {
          content: this.realEnc(item.content, item.groupId),
        },
      });
    });
    return data;
  }
}
