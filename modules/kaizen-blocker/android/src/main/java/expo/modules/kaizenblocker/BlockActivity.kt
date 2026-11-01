package expo.modules.kaizenblocker

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.view.Gravity
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class BlockActivity : Activity() {
  private lateinit var store: BlockerStore

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    store = BlockerStore.getInstance(this)

    val density = resources.displayMetrics.density
    val dp = { value: Int -> (value * density).toInt() }

    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER_HORIZONTAL or Gravity.CENTER_VERTICAL
      setBackgroundColor(Color.parseColor("#131314"))
      val pad = dp(24)
      setPadding(pad, pad, pad, pad)
    }

    // Protocol Active Pill
    val protocolPill = LinearLayout(this).apply {
      orientation = LinearLayout.HORIZONTAL
      gravity = Gravity.CENTER
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#1C1B1C"))
        cornerRadius = 6 * density
      }
      setPadding(dp(10), dp(4), dp(10), dp(4))
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = dp(28)
      }
    }

    val dot = TextView(this).apply {
      text = "● "
      setTextColor(Color.parseColor("#C8372D"))
      textSize = 10f
    }
    val protocolText = TextView(this).apply {
      text = "PROTOCOL ACTIVE  ·  00:00"
      setTextColor(Color.parseColor("#9A968F"))
      textSize = 10f
      typeface = Typeface.MONOSPACE
    }
    protocolPill.addView(dot)
    protocolPill.addView(protocolText)

    // Shield Emblem / Restricted Icon
    val emblem = TextView(this).apply {
      text = "⛨"
      textSize = 44f
      setTextColor(Color.parseColor("#C8372D"))
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = dp(16)
      }
    }

    // Headline
    val headline = TextView(this).apply {
      text = "No time earned"
      textSize = 28f
      setTextColor(Color.parseColor("#F2EFEA"))
      typeface = Typeface.DEFAULT_BOLD
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = dp(8)
      }
    }

    // Subtitle
    val subtitle = TextView(this).apply {
      text = "You have 0 minutes of screen time remaining."
      textSize = 14f
      setTextColor(Color.parseColor("#9A968F"))
      gravity = Gravity.CENTER
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.WRAP_CONTENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = dp(28)
      }
    }

    // Discipline Ritual Card
    val card = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#1C1B1C"))
        cornerRadius = 10 * density
        setStroke(dp(1), Color.parseColor("#2A2A2E"))
      }
      setPadding(dp(16), dp(14), dp(16), dp(14))
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = dp(32)
      }
    }

    val cardTitle = TextView(this).apply {
      text = "DISCIPLINE BALANCE"
      textSize = 11f
      setTextColor(Color.parseColor("#C8372D"))
      typeface = Typeface.DEFAULT_BOLD
      setPadding(0, 0, 0, dp(4))
    }
    val cardMsg = TextView(this).apply {
      text = "Complete a daily ritual in KAIZEN to earn your cognitive allowance."
      textSize = 13f
      setTextColor(Color.parseColor("#F2EFEA"))
      setLineSpacing(0f, 1.2f)
    }
    card.addView(cardTitle)
    card.addView(cardMsg)

    // Primary Action: Open KAIZEN
    val buttonOpenKaizen = Button(this).apply {
      text = "Open KAIZEN  →"
      setTextColor(Color.parseColor("#FFECE9"))
      textSize = 14f
      typeface = Typeface.DEFAULT_BOLD
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#C8372D"))
        cornerRadius = 8 * density
      }
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        dp(48)
      ).apply {
        bottomMargin = dp(10)
      }
      setOnClickListener {
        openApp()
      }
    }

    // Secondary Action: Go Home
    val buttonGoHome = Button(this).apply {
      text = "Go Home"
      setTextColor(Color.parseColor("#9A968F"))
      textSize = 13f
      typeface = Typeface.DEFAULT_BOLD
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#1C1B1C"))
        cornerRadius = 8 * density
        setStroke(dp(1), Color.parseColor("#2A2A2E"))
      }
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        dp(44)
      ).apply {
        bottomMargin = dp(16)
      }
      setOnClickListener {
        navigateHome()
      }
    }

    // Helper text
    val footnote = TextView(this).apply {
      text = "Emergency controls live in the Pressure tab inside KAIZEN."
      textSize = 11f
      setTextColor(Color.parseColor("#5A413D"))
      gravity = Gravity.CENTER
    }

    root.addView(protocolPill)
    root.addView(emblem)
    root.addView(headline)
    root.addView(subtitle)
    root.addView(card)
    root.addView(buttonOpenKaizen)
    root.addView(buttonGoHome)
    root.addView(footnote)

    setContentView(root)
  }

  private fun navigateHome() {
    val homeIntent = Intent(Intent.ACTION_MAIN).apply {
      addCategory(Intent.CATEGORY_HOME)
      flags = Intent.FLAG_ACTIVITY_NEW_TASK
    }
    startActivity(homeIntent)
    finish()
  }

  private fun openApp() {
    val launchIntent = packageManager.getLaunchIntentForPackage(packageName)?.apply {
      flags = Intent.FLAG_ACTIVITY_NEW_TASK or Intent.FLAG_ACTIVITY_CLEAR_TOP
    }
    if (launchIntent != null) {
      startActivity(launchIntent)
    }
    finish()
  }

  override fun onBackPressed() {
    navigateHome()
  }

  override fun onDestroy() {
    if (::store.isInitialized) {
      store.isCurrentlyBlocking = false
    }
    super.onDestroy()
  }
}
