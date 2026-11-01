package expo.modules.kaizenblocker

import android.content.Context
import android.content.Intent
import android.content.pm.PackageManager
import android.net.Uri
import android.os.PowerManager
import android.provider.Settings
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KaizenBlockerModule : Module() {
  private val context: Context
    get() = appContext.reactContext ?: throw IllegalStateException("React application context is not available")

  override fun definition() = ModuleDefinition {
    Name("KaizenBlocker")

    Events("onStatusChanged")

    OnCreate {
      val store = BlockerStore.getInstance(context)
      store.setListener(object : BlockerStore.StateChangeListener {
        override fun onStateChanged() {
          try {
            sendEvent("onStatusChanged", mapOf("remainingMs" to store.remainingMs))
          } catch (_: Throwable) {}
        }
      })
    }

    OnDestroy {
      try {
        BlockerStore.getInstance(context).setListener(null)
      } catch (_: Throwable) {}
    }

    Function("ping") {
      "pong"
    }

    Function("getStatus") {
      val store = BlockerStore.getInstance(context)
      store.tickDrain()
      val pm = context.getSystemService(Context.POWER_SERVICE) as? PowerManager
      val isBatteryIgnored = pm?.isIgnoringBatteryOptimizations(context.packageName) ?: false
      val accessibilityOn = isAccessibilityServiceEnabled(context)

      mapOf(
        "blockerEnabled" to store.blockerEnabled,
        "accessibilityEnabled" to accessibilityOn,
        "batteryUnrestricted" to isBatteryIgnored,
        "remainingMs" to store.remainingMs,
        "activeApp" to store.activeForegroundPackage,
        "isBlocking" to store.isCurrentlyBlocking,
        "blockedApps" to store.blockedPackages.toList()
      )
    }

    Function("setBlockerEnabled") { enabled: Boolean ->
      val store = BlockerStore.getInstance(context)
      store.blockerEnabled = enabled
    }

    Function("setBlockedApps") { packages: List<String> ->
      val validRegex = Regex("^[a-zA-Z0-9_.]+$")
      val selfPackage = context.packageName
      val sanitized = packages
        .map { it.trim() }
        .filter { it.isNotEmpty() && it.length <= 128 && validRegex.matches(it) && it != selfPackage }
        .toSet()

      val store = BlockerStore.getInstance(context)
      store.blockedPackages = sanitized
    }

    Function("grantCredits") { ms: Double ->
      val validMs = ms.toLong().coerceAtLeast(-BlockerStore.MAX_CREDIT_MS).coerceAtMost(BlockerStore.MAX_CREDIT_MS)
      val store = BlockerStore.getInstance(context)
      store.adjustCredits(validMs)
    }

    Function("clearCredits") {
      val store = BlockerStore.getInstance(context)
      store.clearCredits()
    }

    Function("getInstalledApps") {
      val packageManager = context.packageManager
      val intent = Intent(Intent.ACTION_MAIN, null).apply {
        addCategory(Intent.CATEGORY_LAUNCHER)
      }
      val resolvedList = packageManager.queryIntentActivities(intent, 0)
      val selfPackage = context.packageName

      val apps = resolvedList.mapNotNull { resolveInfo ->
        val pkg = resolveInfo.activityInfo.packageName
        if (pkg == selfPackage) null
        else {
          val label = resolveInfo.loadLabel(packageManager)?.toString() ?: pkg
          mapOf("packageName" to pkg, "label" to label)
        }
      }.distinctBy { it["packageName"] }
        .sortedBy { (it["label"] ?: "").lowercase() }

      apps
    }

    Function("openAccessibilitySettings") {
      val intent = Intent(Settings.ACTION_ACCESSIBILITY_SETTINGS).apply {
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      context.startActivity(intent)
    }

    Function("requestIgnoreBatteryOptimizations") {
      val intent = Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS).apply {
        data = Uri.parse("package:${context.packageName}")
        flags = Intent.FLAG_ACTIVITY_NEW_TASK
      }
      context.startActivity(intent)
    }
  }

  private fun isAccessibilityServiceEnabled(context: Context): Boolean {
    if (KaizenAccessibilityService.isServiceRunning()) return true
    val expected = "${context.packageName}/${KaizenAccessibilityService::class.java.canonicalName}"
    val shortExpected = "${context.packageName}/.KaizenAccessibilityService"
    val enabledServices = Settings.Secure.getString(
      context.contentResolver,
      Settings.Secure.ENABLED_ACCESSIBILITY_SERVICES
    ) ?: return false
    return enabledServices.contains(expected) || enabledServices.contains(shortExpected)
  }
}
