import KaizenBlockerModule from './src/KaizenBlockerModule';

export function ping(): string {
  return KaizenBlockerModule.ping();
}

export * from './src/KaizenBlocker.types';
export { default as KaizenBlockerModule } from './src/KaizenBlockerModule';
