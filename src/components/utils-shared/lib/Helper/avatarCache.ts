class AvatarCache {
  private static instance: AvatarCache;
  private cache: Map<string, string>;
  private objectUrls: Set<string>;

  private constructor() {
    this.cache = new Map();
    this.objectUrls = new Set();
  }

  public static getInstance(): AvatarCache {
    if (!AvatarCache.instance) {
      AvatarCache.instance = new AvatarCache();
    }
    return AvatarCache.instance;
  }

  public set(key: string, url: string): void {
    if (url.startsWith('blob:')) return; // Do not save blob URLs
    this.cache.set(key, url);
  }

  public get(key: string): string | undefined {
    return this.cache.get(key);
  }

  public addObjectUrl(url: string): void {
    this.objectUrls.add(url);
  }

  public removeObjectUrl(url: string): void {
    this.objectUrls.delete(url);
  }

  public delete(key: string): void {
    this.cache.delete(key);
  }

  public clear(): void {
    // Revoke all object URLs
    this.objectUrls.forEach((url) => {
      URL.revokeObjectURL(url);
    });
    this.objectUrls.clear();
    this.cache.clear();
  }
}

export const avatarCache = AvatarCache.getInstance();
