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
import { EditGroupDescDto, FetchAllGroupsDto } from './dto/fetch-group.dto';
import { DeleteGroupDto } from './dto/delete-group.dto';
import { AddDelUserDto } from './dto/users-group.dto';

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
    return await this.groupService.createGroup(createGroupDto);
  }

  @SubscribeMessage('fetchAllGroups')
  async fetchAllGroups(@MessageBody() userId: FetchAllGroupsDto) {
    return await this.groupService.fetchAllGroups(userId);
  }

  @SubscribeMessage('deleteGroup')
  async deleteGroup(@MessageBody() body: DeleteGroupDto) {
    return await this.groupService.deleteGroup(body);
  }

  @SubscribeMessage('updateGroupDesc')
  async updateGroupDesc(@MessageBody() body: EditGroupDescDto) {
    return await this.groupService.updateGroupDesc(body);
  }

  // ! to be changed
  @SubscribeMessage('addUserToGroup')
  async addUserToGroup(@MessageBody() body: AddDelUserDto) {
    return await this.groupService.addUserToGroup(body);
  }

  // ! Dont use this endpoint
  // ! to be changed
  @SubscribeMessage('delUserFromGroup')
  async delUserFromGroup(@MessageBody() body: AddDelUserDto) {
    return await this.groupService.delUserFromGroup(body);
  }
}
