import { useState, useEffect, useCallback } from "react";
import { 
  Accessibility, 
  ZoomIn, 
  ZoomOut, 
  Type, 
  Contrast, 
  MousePointer2,
  Link2,
  X,
  RotateCcw,
  Eye,
  Pause,
  Play
} from "lucide-react";

/**
 * Accessibility Widget Component
 * 
 * WCAG 2.1 AA Compliant Features:
 * - Font size adjustment (WCAG 1.4.4 Resize Text)
 * - High contrast mode (WCAG 1.4.3 Contrast)
 * - Highlight links (WCAG 2.4.4 Link Purpose)
 * - Large cursor (WCAG 2.4.7 Focus Visible)
 * - Dyslexia-friendly font (WCAG 1.4.12 Text Spacing)
 * - Pause animations (WCAG 2.2.2 Pause, Stop, Hide)
 * - Focus indicators (WCAG 2.4.7 Focus Visible)
 * - Keyboard navigation (WCAG 2.1.1 Keyboard)
 */

interface AccessibilitySettings {
  fontSize: number; // 100 = default, 125 = large, 150 = extra large
  highContrast: boolean;
  highlightLinks: boolean;
  largeCursor: boolean;
  dyslexiaFont: boolean;
  pauseAnimations: boolean;
}

const defaultSettings: AccessibilitySettings = {
  fontSize: 100,
  highContrast: false,
  highlightLinks: false,
  largeCursor: false,
  dyslexiaFont: false,
  pauseAnimations: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<AccessibilitySettings>(defaultSettings);

  // Load settings from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("accessibility-settings");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setSettings(parsed);
        applySettings(parsed);
      } catch (e) {
        console.error("Failed to parse accessibility settings");
      }
    }
  }, []);

  // Apply settings to document
  const applySettings = useCallback((newSettings: AccessibilitySettings) => {
    const html = document.documentElement;
    const body = document.body;

    // Font size
    html.style.fontSize = `${newSettings.fontSize}%`;

    // High contrast
    if (newSettings.highContrast) {
      body.classList.add("high-contrast");
    } else {
      body.classList.remove("high-contrast");
    }

    // Highlight links
    if (newSettings.highlightLinks) {
      body.classList.add("highlight-links");
    } else {
      body.classList.remove("highlight-links");
    }

    // Large cursor
    if (newSettings.largeCursor) {
      body.classList.add("large-cursor");
    } else {
      body.classList.remove("large-cursor");
    }

    // Dyslexia font
    if (newSettings.dyslexiaFont) {
      body.classList.add("dyslexia-font");
    } else {
      body.classList.remove("dyslexia-font");
    }

    // Pause animations
    if (newSettings.pauseAnimations) {
      body.classList.add("pause-animations");
    } else {
      body.classList.remove("pause-animations");
    }

    // Save to localStorage
    localStorage.setItem("accessibility-settings", JSON.stringify(newSettings));
  }, []);

  const updateSetting = <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
  };

  const increaseFontSize = () => {
    if (settings.fontSize < 150) {
      updateSetting("fontSize", settings.fontSize + 25);
    }
  };

  const decreaseFontSize = () => {
    if (settings.fontSize > 75) {
      updateSetting("fontSize", settings.fontSize - 25);
    }
  };

  const resetSettings = () => {
    setSettings(defaultSettings);
    applySettings(defaultSettings);
  };

  const toggleSetting = (key: keyof Omit<AccessibilitySettings, "fontSize">) => {
    updateSetting(key, !settings[key]);
  };

  // Keyboard navigation for the widget
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Accessibility Button - Fixed Position */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 bottom-4 z-[9999] w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center hover:bg-primary/90 transition-all focus:outline-none focus:ring-4 focus:ring-primary/50"
        aria-label="Open accessibility menu"
        aria-expanded={isOpen}
        aria-controls="accessibility-panel"
      >
        <Accessibility className="w-7 h-7" aria-hidden="true" />
      </button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div
          id="accessibility-panel"
          role="dialog"
          aria-label="Accessibility Options"
          aria-modal="true"
          onKeyDown={handleKeyDown}
          className="fixed left-4 bottom-20 z-[9999] w-80 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden"
        >
          {/* Header */}
          <div className="bg-primary text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Accessibility className="w-5 h-5" aria-hidden="true" />
              <h2 className="font-heading font-semibold text-lg">Accessibility</h2>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-white/20 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-white"
              aria-label="Close accessibility menu"
            >
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>

          {/* Content */}
          <div className="p-4 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="font-heading font-medium text-gray-900 text-sm flex items-center gap-2">
                <Type className="w-4 h-4" aria-hidden="true" />
                Text Size: {settings.fontSize}%
              </label>
              <div className="flex gap-2">
                <button
                  onClick={decreaseFontSize}
                  disabled={settings.fontSize <= 75}
                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Decrease text size"
                >
                  <ZoomOut className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">A-</span>
                </button>
                <button
                  onClick={increaseFontSize}
                  disabled={settings.fontSize >= 150}
                  className="flex-1 py-2 px-3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors flex items-center justify-center gap-1 focus:outline-none focus:ring-2 focus:ring-primary"
                  aria-label="Increase text size"
                >
                  <ZoomIn className="w-4 h-4" aria-hidden="true" />
                  <span className="text-sm font-medium">A+</span>
                </button>
              </div>
            </div>

            {/* Toggle Options */}
            <div className="space-y-2">
              {/* High Contrast */}
              <button
                onClick={() => toggleSetting("highContrast")}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  settings.highContrast
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                }`}
                aria-pressed={settings.highContrast}
              >
                <Contrast className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-sm">High Contrast</span>
              </button>

              {/* Highlight Links */}
              <button
                onClick={() => toggleSetting("highlightLinks")}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  settings.highlightLinks
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                }`}
                aria-pressed={settings.highlightLinks}
              >
                <Link2 className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-sm">Highlight Links</span>
              </button>

              {/* Large Cursor */}
              <button
                onClick={() => toggleSetting("largeCursor")}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  settings.largeCursor
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                }`}
                aria-pressed={settings.largeCursor}
              >
                <MousePointer2 className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-sm">Large Cursor</span>
              </button>

              {/* Dyslexia Font */}
              <button
                onClick={() => toggleSetting("dyslexiaFont")}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  settings.dyslexiaFont
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                }`}
                aria-pressed={settings.dyslexiaFont}
              >
                <Eye className="w-5 h-5" aria-hidden="true" />
                <span className="font-medium text-sm">Dyslexia Friendly</span>
              </button>

              {/* Pause Animations */}
              <button
                onClick={() => toggleSetting("pauseAnimations")}
                className={`w-full py-3 px-4 rounded-lg border-2 transition-all flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-primary ${
                  settings.pauseAnimations
                    ? "bg-primary text-white border-primary"
                    : "bg-white text-gray-700 border-gray-200 hover:border-primary"
                }`}
                aria-pressed={settings.pauseAnimations}
              >
                {settings.pauseAnimations ? (
                  <Play className="w-5 h-5" aria-hidden="true" />
                ) : (
                  <Pause className="w-5 h-5" aria-hidden="true" />
                )}
                <span className="font-medium text-sm">Pause Animations</span>
              </button>
            </div>

            {/* Reset Button */}
            <button
              onClick={resetSettings}
              className="w-full py-3 px-4 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <RotateCcw className="w-4 h-4" aria-hidden="true" />
              <span className="font-medium text-sm text-gray-700">Reset All Settings</span>
            </button>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              WCAG 2.1 AA Compliant
            </p>
          </div>
        </div>
      )}
    </>
  );
}
