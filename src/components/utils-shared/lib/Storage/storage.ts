export const storage = {
  get: (key: string): unknown | null => {
    const item = globalThis.localStorage?.getItem(key);
    try {
      return JSON.parse(item ?? '');
    } catch {
      return item;
    }
  },
  set: (key: string, value: unknown): void => {
    const item = typeof value === 'string' ? value : JSON.stringify(value);
    globalThis.localStorage?.setItem(key, item);
  },
  remove: (key: string): void => {
    globalThis.localStorage?.removeItem(key);
  }
};

export default storage;
