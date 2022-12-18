import { Module } from '@nestjs/common';
import { ConnectionService } from './connection.service';
import { GatewayConnection } from './connection.gateway';

@Module({
  providers: [GatewayConnection, ConnectionService]
})
export class ConnectionModule {}
