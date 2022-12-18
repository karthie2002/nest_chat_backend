import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
import { FetchGroupDto } from './dto/fetch-group.dto';
import { Body } from '@nestjs/common';
@WebSocketGateway({ cors: { origin: '*' } })
export class GroupGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly groupService: GroupService) {}

  @SubscribeMessage('createGroup')
  create(@MessageBody() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }


  @SubscribeMessage('findAllUser')
  findOne(@Body() body:FetchGroupDto) {
    return this.groupService.findGroup(body);
  }

}
