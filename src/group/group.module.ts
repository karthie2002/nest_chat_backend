import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupGateway } from './group.gateway';

@Module({
  providers: [GroupGateway, GroupService]
})
export class GroupModule {}
