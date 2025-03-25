import { UserView } from '@/types/User';

class UserProfileCache {
  private static instance: UserProfileCache;
  private cache: Map<string, UserView>;
  private lastFetch: Map<string, number>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in miliseconds

  private constructor() {
    this.cache = new Map();
    this.lastFetch = new Map();
  }

  public static getInstance(): UserProfileCache {
    if (!UserProfileCache.instance) {
      UserProfileCache.instance = new UserProfileCache();
    }
    return UserProfileCache.instance;
  }

  public get(key: string): UserView | undefined {
    const lastFetchTime = this.lastFetch.get(key);
    if (lastFetchTime && Date.now() - lastFetchTime > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.lastFetch.delete(key);
      return undefined;
    }
    return this.cache.get(key);
  }

  public set(key: string, value: UserView): void {
    this.cache.set(key, value);
    this.lastFetch.set(key, Date.now());
  }

  public clear(): void {
    this.cache.clear();
    this.lastFetch.clear();
  }

  public count(): number {
    return this.cache.size;
  }

  public has(key: string): boolean {
    return this.cache.has(key);
  }

  public delete(key: string): void {
    this.cache.delete(key);
    this.lastFetch.delete(key);
  }
}

export const userProfileCache = UserProfileCache.getInstance();
