package expo.modules.kaizenblocker

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class KaizenBlockerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("KaizenBlocker")

    Function("ping") {
      "pong"
    }
  }
}
