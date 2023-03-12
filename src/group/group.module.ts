import { Module } from '@nestjs/common';
import { GroupService } from './group.service';
import { GroupGateway } from './group.gateway';
import { GatewayConnection } from 'src/connection/connection.gateway';
import { ConnectionService } from 'src/connection/connection.service';
@Module({
  providers: [GroupGateway, GroupService, GatewayConnection, ConnectionService]
})
export class GroupModule {}
