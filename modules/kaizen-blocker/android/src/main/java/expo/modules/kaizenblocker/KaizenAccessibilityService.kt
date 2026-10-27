package expo.modules.kaizenblocker

import android.accessibilityservice.AccessibilityService
import android.view.accessibility.AccessibilityEvent

class KaizenAccessibilityService : AccessibilityService() {
  override fun onAccessibilityEvent(event: AccessibilityEvent?) {
    // Detected window state changes will be handled in section 4
  }

  override fun onInterrupt() {
    // Cleanup will be handled in section 4
  }
}
