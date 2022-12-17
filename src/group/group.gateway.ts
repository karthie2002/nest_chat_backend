import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { GroupService } from './group.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@WebSocketGateway()
export class GroupGateway {
  constructor(private readonly groupService: GroupService) {}

  @SubscribeMessage('createGroup')
  create(@MessageBody() createGroupDto: CreateGroupDto) {
    return this.groupService.create(createGroupDto);
  }

  @SubscribeMessage('findAllGroup')
  findAll() {
    return this.groupService.findAll();
  }

  @SubscribeMessage('findOneGroup')
  findOne(@MessageBody() id: number) {
    return this.groupService.findOne(id);
  }

  @SubscribeMessage('updateGroup')
  update(@MessageBody() updateGroupDto: UpdateGroupDto) {
    return this.groupService.update(updateGroupDto.id, updateGroupDto);
  }

  @SubscribeMessage('removeGroup')
  remove(@MessageBody() id: number) {
    return this.groupService.remove(id);
  }
}
