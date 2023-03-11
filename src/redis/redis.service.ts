import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Redis } from 'ioredis';
import { CacheMessage } from 'src/chat/chat.entity';

@Injectable()
export class RedisService extends Redis {
  constructor(config: ConfigService) {
    super(config.get('REDIS_COMPLETE_LINK'));
  }

  async createCacheStore(storeName: string, storeValue: CacheMessage[]) {
    await this.call('JSON.SET', storeName, '$', JSON.stringify(storeValue));
  }
  async getCacheStore(storeName: string) {
    const json: CacheMessage[] = JSON.parse(
      (await this.call('JSON.GET', storeName)) as string,
    );
    return json;
  }
  async storeRecentChat(storeName: string, storeData: CacheMessage) {
    let json: CacheMessage[] = JSON.parse(
      (await this.call('JSON.GET', storeName)) as string,
    );
    if (json == null) {
      json = [storeData];
    } else {
      json = [storeData, ...json];
      json.pop();
    }

    await this.call('JSON.SET', storeName, '$', JSON.stringify(json));
  }
}