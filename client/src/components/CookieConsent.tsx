import { useState, useEffect } from "react";
import { Link } from "wouter";
import { X, Cookie } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

const COOKIE_CONSENT_KEY = "gurovich-cookie-consent";

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      // Delay showing the banner for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
        // Trigger animation after mount
        requestAnimationFrame(() => {
          setIsAnimating(true);
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    closeBanner();
  };

  const handleReject = () => {
    localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    closeBanner();
  };

  const closeBanner = () => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsVisible(false);
    }, 300);
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ease-out ${
        isAnimating ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="bg-secondary border-t border-white/10 shadow-2xl">
        <div className="container py-4 md:py-5">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-6">
            {/* Icon and Text */}
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                <Cookie className="w-6 h-6 text-primary" />
              </div>
              <div className="text-sm text-white/80">
                <p className="font-medium text-white mb-1">{t("cookie.title")}</p>
                <p className="leading-relaxed">
                  {t("cookie.description")}{" "}
                  <Link href="/privacy" className="text-primary hover:underline">
                    {t("cookie.privacyLink")}
                  </Link>{" "}
                  {t("cookie.moreInfo")}
                </p>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReject}
                className="flex-1 md:flex-none border-white/20 text-white hover:bg-white/10"
              >
                {t("cookie.rejectAll")}
              </Button>
              <Button
                size="sm"
                onClick={handleAccept}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
              >
                {t("cookie.acceptAll")}
              </Button>
            </div>

            {/* Close button */}
            <button
              onClick={handleReject}
              className="absolute top-3 right-3 md:static p-1 text-white/50 hover:text-white transition-colors"
              aria-label="Close cookie banner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
