import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { GatewayConnection } from 'src/connection/connection.gateway';
import { FetchGroupDto } from './dto/fetch-group.dto';
import { Body } from '@nestjs/common';
@WebSocketGateway({ cors: { origin: '*' } })
export class GroupGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly groupService: GroupService,
    private readonly app: GatewayConnection,
  ) {}

  @SubscribeMessage('createGroup')
  async createGroup(@MessageBody() createGroupDto: CreateGroupDto) {
    console.log('hello');
    return await this.groupService.createGroup(createGroupDto);
  }

  @SubscribeMessage('findAllUser')
  findOne(@Body() body: FetchGroupDto) {
    return this.groupService.findGroup(body);
  }
}
