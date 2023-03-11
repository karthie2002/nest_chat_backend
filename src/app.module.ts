import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { UserModule } from './user/user.module';
import { GroupModule } from './group/group.module';
import { ConnectionModule } from './connection/connection.module';
import { ChatModule } from './chat/chat.module';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [UserModule, PrismaModule, ConfigModule.forRoot({ isGlobal: true }), GroupModule, ConnectionModule, ChatModule, RedisModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
