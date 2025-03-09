import {
  DeleteDateProps,
  GetDataProps,
  SetDataProps,
} from "@app/common/cache/cache";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import { Inject, Injectable } from "@nestjs/common";
import { Cache } from "cache-manager";

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cache: Cache) {}

  public async setData<T>({
    key,
    value,
    bucket = "0",
    expires_in = 0,
  }: SetDataProps<T>) {
    try {
      await this.cache.set(`${bucket}:${key}`, value, expires_in);
    } catch (error) {
      throw error;
    }
  }

  public async getData<T>({ key, bucket = "0" }: GetDataProps): Promise<T> {
    try {
      return await this.cache.get(`${bucket}:${key}`);
    } catch (error) {
      throw error;
    }
  }

  public async deleteData({ key, bucket = "0" }: DeleteDateProps) {
    try {
      await this.cache.del(`${bucket}:${key}`);
    } catch (error) {
      throw error;
    }
  }
}
