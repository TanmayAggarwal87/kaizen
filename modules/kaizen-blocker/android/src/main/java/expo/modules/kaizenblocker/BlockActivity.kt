package expo.modules.kaizenblocker

import android.app.Activity
import android.content.Intent
import android.graphics.Color
import android.graphics.Typeface
import android.graphics.drawable.GradientDrawable
import android.os.Bundle
import android.os.CountDownTimer
import android.view.Gravity
import android.view.MotionEvent
import android.view.View
import android.widget.Button
import android.widget.LinearLayout
import android.widget.TextView

class BlockActivity : Activity() {
  private lateinit var store: BlockerStore
  private var emergencyTimer: CountDownTimer? = null
  private lateinit var emergencyButton: Button

  override fun onCreate(savedInstanceState: Bundle?) {
    super.onCreate(savedInstanceState)
    store = BlockerStore.getInstance(this)

    val root = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      setBackgroundColor(Color.parseColor("#0A0A0B"))
      val pad = (24 * resources.displayMetrics.density).toInt()
      setPadding(pad, pad, pad, pad)
    }

    val brandTitle = TextView(this).apply {
      text = "KAIZEN"
      textSize = 28f
      setTextColor(Color.parseColor("#F2EFEA"))
      typeface = Typeface.DEFAULT_BOLD
      gravity = Gravity.CENTER
    }

    val brandSubtitle = TextView(this).apply {
      text = "改善"
      textSize = 14f
      setTextColor(Color.parseColor("#9A968F"))
      gravity = Gravity.CENTER
      setPadding(0, 0, 0, (32 * resources.displayMetrics.density).toInt())
    }

    val warningCard = LinearLayout(this).apply {
      orientation = LinearLayout.VERTICAL
      gravity = Gravity.CENTER
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#141416"))
        cornerRadius = 16 * resources.displayMetrics.density
        setStroke((1 * resources.displayMetrics.density).toInt(), Color.parseColor("#2A2A2E"))
      }
      val cardPad = (24 * resources.displayMetrics.density).toInt()
      setPadding(cardPad, cardPad, cardPad, cardPad)
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        LinearLayout.LayoutParams.WRAP_CONTENT
      ).apply {
        bottomMargin = (32 * resources.displayMetrics.density).toInt()
      }
    }

    val messageView = TextView(this).apply {
      text = "No time earned"
      textSize = 20f
      setTextColor(Color.parseColor("#F2EFEA"))
      typeface = Typeface.DEFAULT_BOLD
      gravity = Gravity.CENTER
      setPadding(0, 0, 0, (8 * resources.displayMetrics.density).toInt())
    }

    val remainingView = TextView(this).apply {
      val mins = (store.remainingMs / 1000) / 60
      val secs = (store.remainingMs / 1000) % 60
      text = String.format("Remaining balance: %02dm %02ds", mins, secs)
      textSize = 14f
      setTextColor(Color.parseColor("#9A968F"))
      gravity = Gravity.CENTER
    }

    warningCard.addView(messageView)
    warningCard.addView(remainingView)

    val buttonGoHome = Button(this).apply {
      text = "Go Home"
      setTextColor(Color.parseColor("#F2EFEA"))
      textSize = 15f
      typeface = Typeface.DEFAULT_BOLD
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#C8372D"))
        cornerRadius = 10 * resources.displayMetrics.density
      }
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        (48 * resources.displayMetrics.density).toInt()
      ).apply {
        bottomMargin = (12 * resources.displayMetrics.density).toInt()
      }
      setOnClickListener {
        navigateHome()
      }
    }

    val buttonOpenKaizen = Button(this).apply {
      text = "Open kaizen"
      setTextColor(Color.parseColor("#F2EFEA"))
      textSize = 15f
      background = GradientDrawable().apply {
        setColor(Color.parseColor("#1D1D20"))
        cornerRadius = 10 * resources.displayMetrics.density
        setStroke((1 * resources.displayMetrics.density).toInt(), Color.parseColor("#2A2A2E"))
      }
      layoutParams = LinearLayout.LayoutParams(
        LinearLayout.LayoutParams.MATCH_PARENT,
        (48 * resources.displayMetrics.density).toInt()
      ).apply {
        bottomMargin = (24 * resources.displayMetrics.density).toInt()
      }
      setOnClickListener {
        openApp()
      }
    }

    emergencyButton = Button(this).apply {
      text = "Hold to Emergency Disable (5s)"
      setTextColor(Color.parseColor("#9A968F"))
      textSize = 12f
      background = GradientDrawable().apply {
        setColor(Color.TRANSPARENT)
      }
      setOnTouchListener { _, event ->
        when (event.action) {
          MotionEvent.ACTION_DOWN -> {
            startEmergencyCountdown()
            true
          }
          MotionEvent.ACTION_UP, MotionEvent.ACTION_CANCEL -> {
            cancelEmergencyCountdown()
            true
          }
          else -> false
        }
      }
    }

    root.addView(brandTitle)
    root.addView(brandSubtitle)
    root.addView(warningCard)
    root.addView(buttonGoHome)
    root.addView(buttonOpenKaizen)
    root.addView(emergencyButton)

    setContentView(root)
  }

  private fun startEmergencyCountdown() {
    emergencyTimer?.cancel()
    emergencyTimer = object : CountDownTimer(5000, 1000) {
      override fun onTick(millisUntilFinished: Long) {
        val seconds = (millisUntilFinished / 1000) + 1
        emergencyButton.text = "Keep holding: $seconds s..."
        emergencyButton.setTextColor(Color.parseColor("#E5584B"))
      }

      override fun onFinish() {
        store.blockerEnabled = false
        emergencyButton.text = "Blocker Disabled"
        finish()
      }
    }.start()
  }

  private fun cancelEmergencyCountdown() {
    emergencyTimer?.cancel()
    emergencyTimer = null
    emergencyButton.text = "Hold to Emergency Disable (5s)"
    emergencyButton.setTextColor(Color.parseColor("#9A968F"))
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
    emergencyTimer?.cancel()
    super.onDestroy()
  }
}
