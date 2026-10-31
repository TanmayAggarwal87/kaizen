/**
 * Safe persistent storage wrapper with automatic in-memory fallback.
 * Prevents application crash if the native AsyncStorage binary is not yet linked.
 */

const memoryStore = new Map<string, string>();

type AsyncStorageType = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<void>;
  removeItem: (key: string) => Promise<void>;
};

let nativeStorage: AsyncStorageType | null = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const mod = require('@react-native-async-storage/async-storage');
  nativeStorage = mod?.default ?? mod ?? null;
} catch {
  // Gracefully fall back to memoryStore
  nativeStorage = null;
}

export const safeStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      if (nativeStorage && typeof nativeStorage.getItem === 'function') {
        const val = await nativeStorage.getItem(key);
        if (val !== null) return val;
      }
    } catch {
      // Native storage call failed; fall back to memoryStore
    }
    return memoryStore.get(key) ?? null;
  },

  async setItem(key: string, value: string): Promise<void> {
    memoryStore.set(key, value);
    try {
      if (nativeStorage && typeof nativeStorage.setItem === 'function') {
        await nativeStorage.setItem(key, value);
      }
    } catch {
      // Retained in memoryStore
    }
  },

  async removeItem(key: string): Promise<void> {
    memoryStore.delete(key);
    try {
      if (nativeStorage && typeof nativeStorage.removeItem === 'function') {
        await nativeStorage.removeItem(key);
      }
    } catch {}
  },
};
