import { Global, OnModuleInit } from '@nestjs/common';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';

import { Server, Socket } from 'socket.io';
import { CreateGroupDto } from 'src/group/dto/create-group.dto';

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
  constructor() {
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
    this.server.emit('disconnect', 'disconnected from server');
  }
}
