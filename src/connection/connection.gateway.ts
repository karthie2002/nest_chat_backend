import { Global, OnModuleInit } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets/interfaces';

import { Server, Socket } from 'socket.io';
import { ConnectionService } from './connection.service';
import { UserOnlineDto } from './dto/user-online.dto';

@Global()
@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class GatewayConnection
  implements OnModuleInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  public clientIds: Object;
  constructor(private readonly connectionService: ConnectionService) {
    this.clientIds = new Object();
  }

  onModuleInit() {
    this.server.on('connection', (client: Socket) => {
      // console.log(client);
      if (
        client.handshake.headers.senderid != undefined &&
        String(client.handshake.headers.senderid) != ''
      ) {
        this.clientIds[String(client.handshake.headers.senderid)] = client.id;
        console.log(this.clientIds);
        return client.id;
      } else {
        this.server.emit('error', 'Some error occurred');
      }
    });
  }

  handleConnection() {
    console.log('Conn handled!!');
    this.server.emit('handleConn', 'connection handled');
  }
  handleDisconnect() {
    console.log('disconnected!!');
    this.server.emit('disconnected', 'disconnected from server');
  }
  @SubscribeMessage('onlineUser')
  async UserOnline(
    @ConnectedSocket() client: Socket,
    @MessageBody() onlineBool: UserOnlineDto,
  ) {
    const res = await this.connectionService.UserOnline(onlineBool);
    res.group.forEach((item) => {
      client.broadcast.to(item.id).emit('onlineStatus', item.user);
    });
  }
  @SubscribeMessage('offlineUser')
  async UserOffline(
    @ConnectedSocket() client: Socket,
    @MessageBody() onlineBool: UserOnlineDto,
  ) {
    const res = await this.connectionService.UserOffline(onlineBool);
    res.group.forEach((item) => {
      client.broadcast.to(item.id).emit('onlineStatus', item.user);
    });
  }
}
