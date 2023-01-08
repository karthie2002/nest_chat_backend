import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  OnGatewayInit,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

import { ChatService } from './chat.service';
import { CreateChatDto, JoinLeaveRoomDto } from './dto/create-chat.dto';
import { DeleteMessageDto } from './dto/delete-chat.dto';
import { FetchAllMessagesDto } from './dto/fetch-chat.dto';
import { UpdateMessageDto, MessageReadDto } from './dto/update-chat.dto';

@WebSocketGateway({ cors: { origin: '*' } })
export class ChatGateway {
  @WebSocketServer() wss: Server;
  constructor(private readonly chatService: ChatService) {}

  //Sending a new message to a group(room)
  @SubscribeMessage('chatToServer')
  async handleMessage(@MessageBody() message: CreateChatDto) {
    const data = await this.chatService.createMessage(message);
    this.wss.sockets.to(message.groupId).emit('chatToClient', data);
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
    console.log(room);
    client.join(room.groupId);
    client.emit('joined', room.groupId);
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
