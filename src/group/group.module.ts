import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupGateway } from './group.gateway';
import { GatewayConnection } from 'src/connection/connection.gateway';
@Module({
  providers: [GroupGateway, GroupService, GatewayConnection]
})
export class GroupModule {}
