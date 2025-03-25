// TODO: Once we refactor to add middleware to manage the app state,
// it might be interesting to save, instead of `string[]` in the `xxx` type:
//
// type xxx {
//   // total number of pubkys for that relationship
//   number: number;
//   // save some random users to display in the user card,
//   // for example when hovering over a profile (e.g. in post lists)
//   random: string[];
// }
//
// type Relationship = {
//   following: xxx;
//   followers: xxx;
//   friends: xxx;
// }
type Relationship = {
  following: string[] | undefined;
  followers: string[] | undefined;
  friends: string[] | undefined;
};

function createDefaultRelationship(): Relationship {
  return {
    following: undefined,
    followers: undefined,
    friends: undefined
  };
}

class UserRelationshipCache {
  private static instance: UserRelationshipCache;
  private cache: Map<string, Relationship>;
  private lastFetch: Map<string, number>;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes in miliseconds

  private constructor() {
    this.cache = new Map();
    this.lastFetch = new Map();
  }

  public static getInstance(): UserRelationshipCache {
    if (!UserRelationshipCache.instance) {
      UserRelationshipCache.instance = new UserRelationshipCache();
    }
    return UserRelationshipCache.instance;
  }

  public get(key: string, relationshipType: string): string[] | undefined {
    const lastFetchTime = this.lastFetch.get(key);
    if (lastFetchTime && Date.now() - lastFetchTime > this.CACHE_DURATION) {
      this.cache.delete(key);
      this.lastFetch.delete(key);
      return undefined;
    }
    const relationship = this.cache.get(key);
    return relationship?.[relationshipType];
  }

  // TODO: relationshipType, should be 'keyof Relationship' type
  public set(key: string, relationshipType: string, value: string[]): void {
    let relationship = this.cache.get(key);
    // Make sure if the relationship for that user exist, if not, create a new entry
    if (!relationship) {
      let new_relationship = createDefaultRelationship();
      this.cache.set(key, new_relationship);
      this.lastFetch.set(key, Date.now());
      relationship = new_relationship;
    }
    relationship[relationshipType] = value;
    this.cache.set(key, relationship);
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

export const userRelationshipCache = UserRelationshipCache.getInstance();
