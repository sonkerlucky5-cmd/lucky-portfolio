import { useState, useEffect } from "react";
import { ShieldCheck, X } from "lucide-react";

const CookieConsent = ({ onOpenPrivacy }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("portfolio_cookie_consent");
    if (!consent) {
      // Delay showing banner slightly for smooth UX
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("portfolio_cookie_consent", "granted");
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("portfolio_cookie_consent", "denied");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      className="cookie-consent-bar"
      role="region"
      aria-label="Privacy and Cookie Consent"
    >
      <div className="cookie-consent-content">
        <div className="cookie-consent-text">
          <ShieldCheck size={18} className="cookie-shield-icon" />
          <span>
            We respect your privacy. This site uses only essential local storage (theme settings) and privacy-first anonymous visit metrics — zero cross-site tracking or commercial cookies.{" "}
            {onOpenPrivacy && (
              <button
                type="button"
                className="cookie-link-btn"
                onClick={onOpenPrivacy}
              >
                Read Privacy Policy
              </button>
            )}
          </span>
        </div>

        <div className="cookie-consent-actions">
          <button
            type="button"
            className="btn btn-outline cookie-btn-decline"
            onClick={handleDecline}
          >
            Decline
          </button>
          <button
            type="button"
            className="btn btn-primary cookie-btn-accept"
            onClick={handleAccept}
          >
            Accept
          </button>
          <button
            type="button"
            className="cookie-close-icon"
            onClick={handleDecline}
            aria-label="Dismiss privacy banner"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default CookieConsent;

