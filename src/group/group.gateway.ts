import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';

import { WebSocketServer } from '@nestjs/websockets/decorators';
import { Server, Socket } from 'socket.io';
@WebSocketGateway({ cors: { origin: '*' } })
export class GroupGateway {
  @WebSocketServer()
  server: Server;
  constructor(private readonly groupService: GroupService) {}

  @SubscribeMessage('createGroup')
  create(@MessageBody() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }


  @SubscribeMessage('findOneGroup')
  findOne(@MessageBody() id: number) {
    return this.groupService.findOne(id);
  }

}
