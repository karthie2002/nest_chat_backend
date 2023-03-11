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
    console.log(json);
    if (json == null || json.length == 0) {
      json = [storeData];
    } else {
      json = [storeData, ...json];
    }
    if (json.length > 25) {
      json.pop();
    }

    await this.call('JSON.SET', storeName, '$', JSON.stringify(json));
  }
}
