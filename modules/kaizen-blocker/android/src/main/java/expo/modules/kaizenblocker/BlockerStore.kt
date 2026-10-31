package expo.modules.kaizenblocker

import android.content.Context
import android.content.SharedPreferences
import android.os.SystemClock

// shortcut: Android SharedPreferences used for atomic local persistence without external Jetpack dependencies; upgrade to Proto DataStore if structured migration is required.
class BlockerStore(context: Context) {
  private val prefs: SharedPreferences = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
  private val lock = Any()

  interface StateChangeListener {
    fun onStateChanged()
  }

  private var listener: StateChangeListener? = null

  fun setListener(l: StateChangeListener?) {
    synchronized(lock) {
      listener = l
    }
  }

  var blockerEnabled: Boolean
    get() = prefs.getBoolean(KEY_BLOCKER_ENABLED, true)
    set(value) {
      prefs.edit().putBoolean(KEY_BLOCKER_ENABLED, value).apply()
      notifyChanged()
    }

  var blockedPackages: Set<String>
    get() {
      val set = prefs.getStringSet(KEY_BLOCKED_PACKAGES, null)
      if (set == null) {
        val defaults = setOf(
          "com.instagram.android",
          "com.twitter.android",
          "com.google.android.youtube",
          "com.reddit.frontpage",
          "com.zhiliaoapp.musically"
        )
        prefs.edit().putStringSet(KEY_BLOCKED_PACKAGES, defaults).apply()
        return defaults
      }
      return set
    }
    set(value) {
      prefs.edit().putStringSet(KEY_BLOCKED_PACKAGES, HashSet(value)).apply()
      notifyChanged()
    }

  var remainingMs: Long
    get() = prefs.getLong(KEY_REMAINING_MS, 0L)
    set(value) {
      val clamped = value.coerceAtLeast(0L).coerceAtMost(MAX_CREDIT_MS)
      prefs.edit().putLong(KEY_REMAINING_MS, clamped).apply()
      notifyChanged()
    }

  @Volatile
  var activeForegroundPackage: String? = null

  @Volatile
  var isCurrentlyBlocking: Boolean = false

  @Volatile
  private var lastDrainTimestampMs: Long = 0L

  fun startDraining(packageName: String) {
    synchronized(lock) {
      drainCurrentActive(SystemClock.elapsedRealtime())
      activeForegroundPackage = packageName
      lastDrainTimestampMs = SystemClock.elapsedRealtime()
    }
  }

  fun stopDraining() {
    synchronized(lock) {
      drainCurrentActive(SystemClock.elapsedRealtime())
      activeForegroundPackage = null
      lastDrainTimestampMs = 0L
    }
  }

  fun tickDrain(): Long {
    synchronized(lock) {
      if (activeForegroundPackage != null && lastDrainTimestampMs > 0L) {
        val now = SystemClock.elapsedRealtime()
        drainCurrentActive(now)
        lastDrainTimestampMs = now
      }
      return remainingMs
    }
  }

  private fun drainCurrentActive(now: Long) {
    if (activeForegroundPackage == null || lastDrainTimestampMs <= 0L) return
    val elapsed = (now - lastDrainTimestampMs).coerceAtLeast(0L)
    if (elapsed > 0) {
      val current = remainingMs
      val updated = (current - elapsed).coerceAtLeast(0L)
      prefs.edit().putLong(KEY_REMAINING_MS, updated).apply()
      if (updated != current) {
        notifyChanged()
      }
    }
  }

  fun adjustCredits(deltaMs: Long) {
    synchronized(lock) {
      val current = remainingMs
      val updated = (current + deltaMs).coerceAtLeast(0L).coerceAtMost(MAX_CREDIT_MS)
      prefs.edit().putLong(KEY_REMAINING_MS, updated).apply()
      notifyChanged()
    }
  }

  fun grantCredits(additionalMs: Long) {
    adjustCredits(additionalMs)
  }

  fun clearCredits() {
    synchronized(lock) {
      prefs.edit().putLong(KEY_REMAINING_MS, 0L).apply()
      notifyChanged()
    }
  }

  private fun notifyChanged() {
    listener?.onStateChanged()
  }

  companion object {
    private const val PREFS_NAME = "kaizen_blocker_prefs"
    private const val KEY_BLOCKER_ENABLED = "blocker_enabled"
    private const val KEY_BLOCKED_PACKAGES = "blocked_packages"
    private const val KEY_REMAINING_MS = "remaining_ms"
    const val MAX_CREDIT_MS = 24 * 60 * 60 * 1000L // 24 hours ceiling

    @Volatile
    private var instance: BlockerStore? = null

    fun getInstance(context: Context): BlockerStore {
      return instance ?: synchronized(this) {
        instance ?: BlockerStore(context.applicationContext).also { instance = it }
      }
    }
  }
}
