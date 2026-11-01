package expo.modules.kaizenblocker

import android.accessibilityservice.AccessibilityService
import android.content.BroadcastReceiver
import android.content.Context
import android.content.Intent
import android.content.IntentFilter
import android.content.pm.PackageManager
import android.os.Handler
import android.os.Looper
import android.os.SystemClock
import android.telecom.TelecomManager
import android.view.accessibility.AccessibilityEvent

class KaizenAccessibilityService : AccessibilityService() {
  private lateinit var store: BlockerStore
  private val handler = Handler(Looper.getMainLooper())
  private var lastHandledPackage: String? = null
  private var lastEventTime: Long = 0L

  private val screenReceiver = object : BroadcastReceiver() {
    override fun onReceive(context: Context?, intent: Intent?) {
      if (intent?.action == Intent.ACTION_SCREEN_OFF) {
        if (::store.isInitialized) {
          store.stopDraining()
        }
        lastHandledPackage = null
        handler.removeCallbacks(tickRunnable)
      }
    }
  }

  private val tickRunnable = object : Runnable {
    override fun run() {
      try {
        val remaining = store.tickDrain()
        if (remaining <= 0L && store.activeForegroundPackage != null) {
          val target = store.activeForegroundPackage
          store.stopDraining()
          if (target != null && store.blockedPackages.contains(target)) {
            enforceBlock()
          }
        } else if (store.activeForegroundPackage != null) {
          handler.postDelayed(this, DRAIN_TICK_INTERVAL_MS)
        }
      } catch (t: Throwable) {
        if (store.activeForegroundPackage != null) {
          handler.postDelayed(this, DRAIN_TICK_INTERVAL_MS)
        }
      }
    }
  }

  override fun onServiceConnected() {
    super.onServiceConnected()
    store = BlockerStore.getInstance(this)
    activeServiceInstance = this

    try {
      val filter = IntentFilter(Intent.ACTION_SCREEN_OFF)
      registerReceiver(screenReceiver, filter)
    } catch (_: Exception) {}
  }

  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    if (event == null || event.eventType != AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED) {
      return
    }

    val pkg = event.packageName?.toString() ?: return

    // Never stop or disrupt an active countdown due to transient system overlays or keyboards
    if (isTransientOrSystemOverlay(pkg)) {
      return
    }

    val now = SystemClock.elapsedRealtime()
    if (pkg == lastHandledPackage && (now - lastEventTime) < DEBOUNCE_INTERVAL_MS) {
      return
    }

    lastHandledPackage = pkg
    lastEventTime = now

    handleForegroundPackage(pkg)
  }

  private fun handleForegroundPackage(pkg: String) {
    if (!::store.isInitialized) {
      store = BlockerStore.getInstance(this)
    }

    if (isExemptPackage(pkg) || !store.blockerEnabled) {
      store.stopDraining()
      handler.removeCallbacks(tickRunnable)
      return
    }

    if (store.blockedPackages.contains(pkg)) {
      val remaining = store.remainingMs
      if (remaining <= 0L) {
        store.stopDraining()
        handler.removeCallbacks(tickRunnable)
        enforceBlock()
      } else {
        val wasDraining = store.activeForegroundPackage == pkg
        store.startDraining(pkg)
        if (!wasDraining) {
          handler.removeCallbacks(tickRunnable)
          handler.postDelayed(tickRunnable, DRAIN_TICK_INTERVAL_MS)
        }
      }
    } else {
      store.stopDraining()
      handler.removeCallbacks(tickRunnable)
    }
  }

  private fun enforceBlock() {
    store.isCurrentlyBlocking = true
    performGlobalAction(GLOBAL_ACTION_HOME)
    val blockIntent = Intent(this, BlockActivity::class.java).apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TASK or Intent.FLAG_ACTIVITY_NO_ANIMATION
    }
    handler.postDelayed({
      try {
        startActivity(blockIntent)
      } catch (_: Throwable) {}
    }, 100L)
  }

  private fun isTransientOrSystemOverlay(pkg: String): Boolean {
    if (pkg == "android" || pkg == "com.android.systemui" || pkg.endsWith(".systemui")) return true
    if (pkg == "com.google.android.gms" || pkg == "com.google.android.gsf") return true
    if (pkg == "com.google.android.permissioncontroller") return true
    if (pkg.contains("inputmethod") || pkg.contains(".ime") || pkg.contains("keyboard") || pkg.contains("honeyboard")) return true
    if (pkg.startsWith("com.coloros.") || pkg.startsWith("com.oplus.") ||
        pkg.startsWith("com.heytap.") || pkg.startsWith("com.nearme.") ||
        pkg.startsWith("com.realme.")) {
      if (pkg.contains("launcher") || pkg.contains("home") || pkg.contains("settings")) return false
      return true
    }
    return false
  }

  private fun isExemptPackage(pkg: String): Boolean {
    if (pkg == packageName) return true
    if (pkg == "com.android.settings") return true

    // Dynamically resolve default launcher
    val homeIntent = Intent(Intent.ACTION_MAIN).addCategory(Intent.CATEGORY_HOME)
    val defaultHome = packageManager.resolveActivity(homeIntent, PackageManager.MATCH_DEFAULT_ONLY)
    if (defaultHome?.activityInfo?.packageName == pkg) return true

    // Dynamically resolve dialer and emergency calls
    val telecomManager = getSystemService(Context.TELECOM_SERVICE) as? TelecomManager
    val defaultDialer = telecomManager?.defaultDialerPackage
    if (defaultDialer == pkg) return true

    val dialIntent = Intent(Intent.ACTION_DIAL)
    val dialerResolution = packageManager.resolveActivity(dialIntent, PackageManager.MATCH_DEFAULT_ONLY)
    if (dialerResolution?.activityInfo?.packageName == pkg) return true

    return false
  }

  override fun onInterrupt() {
    handler.removeCallbacks(tickRunnable)
    if (::store.isInitialized) {
      store.stopDraining()
    }
  }

  override fun onDestroy() {
    activeServiceInstance = null
    handler.removeCallbacks(tickRunnable)
    try {
      unregisterReceiver(screenReceiver)
    } catch (_: Exception) {}
    if (::store.isInitialized) {
      store.stopDraining()
    }
    super.onDestroy()
  }

  companion object {
    private const val DEBOUNCE_INTERVAL_MS = 150L
    private const val DRAIN_TICK_INTERVAL_MS = 1000L

    @Volatile
    var activeServiceInstance: KaizenAccessibilityService? = null
      private set

    fun isServiceRunning(): Boolean {
      return activeServiceInstance != null
    }
  }
}
