package expo.modules.kaizenblocker

import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent

class BootReceiver : BroadcastReceiver() {
  override fun onReceive(context: Context?, intent: Intent?) {
    if (context == null || intent?.action != Intent.ACTION_BOOT_COMPLETED) return
    val store = BlockerStore.getInstance(context)
    store.stopDraining()
  }
}
