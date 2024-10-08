import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import { RedisService } from 'src/redis/redis.service';
import { ChatService } from './chat.service';
import {
  CreateChatDto,
  JoinLeaveRoomDto,
  TypingDto,
} from './dto/create-chat.dto';
import { DeleteMessageDto } from './dto/delete-chat.dto';
import { FetchAllMessagesDto } from './dto/fetch-chat.dto';
import { UpdateMessageDto } from './dto/update-chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() wss: Server;
  constructor(
    private readonly chatService: ChatService,
    private readonly redisService: RedisService,
  ) {}

  //Sending a new message to a group(room)
  @SubscribeMessage('chatToServer')
  async handleMessage(@MessageBody() message: CreateChatDto) {
    const data = await this.chatService.createMessage(message);
    this.wss.sockets.to(message.groupId).emit('chatToClient', data);
    this.redisService.storeRecentChat(`Group:${message.groupId}`, data);
  }
  //Fetches all the messages in a group(room) - fetchAllMessages
  @SubscribeMessage('fetchAllMessages')
  async findAll(
    @ConnectedSocket() client: Socket,
    @MessageBody() fetchAllMessagesDto: FetchAllMessagesDto,
  ) {
    const data = await this.chatService.fetchAllMessages(fetchAllMessagesDto);
    return data;
  }

  // ! group id to be sent, last seen
  //Clicking on a group/ entering a room
  @SubscribeMessage('joinRoom')
  handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: JoinLeaveRoomDto,
  ) {
    client.join(room.groupId);
    client.emit('joined', room.groupId);
  }

  @SubscribeMessage('typing')
  handleType(
    @ConnectedSocket() client: Socket,
    @MessageBody() details: TypingDto,
  ) {
    client.broadcast.to(details.groupId).emit('typing', details);
    // console.log(details);
  }

  //Exiting from a group/ leaving a room
  @SubscribeMessage('leaveRoom')
  handleLeaveRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() room: JoinLeaveRoomDto,
  ) {
    client.leave(room.groupId);
    client.emit('left', room.groupId);
  }

  //Edit an already existing message
  @SubscribeMessage('editMessage')
  async updateMessage(@MessageBody() updateChatDto: UpdateMessageDto) {
    return await this.chatService.updateMessage(updateChatDto);
  }

  // @SubscribeMessage('adminEnc')
  // async encryption() {
  //   return await this.chatService.encryption();
  // }

  // @SubscribeMessage('adminDec')
  // async decryption() {
  //   return await this.chatService.decryption();
  // }

  //Delete a message
  @SubscribeMessage('deleteMessage')
  async deleteMessage(@MessageBody() message: DeleteMessageDto) {
    return await this.chatService.deleteMessage(message);
  }

  // @SubscribeMessage('messageRead')
  // async messageRead(@MessageBody() messageReadDto: MessageReadDto) {
  //   return await this.chatService.messageRead(messageReadDto);
  // }
}
