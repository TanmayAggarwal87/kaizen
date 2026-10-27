import { NativeModule, requireNativeModule } from 'expo';
import { KaizenBlockerModuleEvents } from './KaizenBlocker.types';

declare class KaizenBlockerModule extends NativeModule<KaizenBlockerModuleEvents> {
  ping(): string;
}

export default requireNativeModule<KaizenBlockerModule>('KaizenBlocker');
