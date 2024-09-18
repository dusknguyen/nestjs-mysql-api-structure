/* eslint-disable import/no-extraneous-dependencies */
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  public async addToCache<T>(key: string, item: T): Promise<void> {
    await this.cacheManager.set(key, item);
  }

  public async getFromCache<T>(key: string): Promise<T | undefined> {
    return this.cacheManager.get<T>(key);
  }
}
