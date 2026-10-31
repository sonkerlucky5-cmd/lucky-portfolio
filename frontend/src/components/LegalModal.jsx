import { useState, useEffect } from "react";
import { FileText, Shield, X, CheckCircle2 } from "lucide-react";

const LegalModal = ({ isOpen, initialTab = "privacy", onClose }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleEsc);
    }
    return () => {
      document.body.style.overflow = "auto";
      window.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="legal-modal-backdrop" role="dialog" aria-modal="true">
      <div className="legal-modal-card">
        {/* Header */}
        <div className="legal-modal-header">
          <div className="legal-tabs-nav">
            <button
              className={`legal-tab-btn ${activeTab === "privacy" ? "active" : ""}`}
              onClick={() => setActiveTab("privacy")}
            >
              <Shield size={16} />
              <span>Privacy Policy</span>
            </button>
            <button
              className={`legal-tab-btn ${activeTab === "terms" ? "active" : ""}`}
              onClick={() => setActiveTab("terms")}
            >
              <FileText size={16} />
              <span>Terms &amp; Conditions</span>
            </button>
          </div>

          <button
            type="button"
            className="legal-modal-close"
            onClick={onClose}
            aria-label="Close legal modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content Body */}
        <div className="legal-modal-body">
          {activeTab === "privacy" ? (
            <article className="legal-doc">
              <h2>Privacy Policy</h2>
              <p className="legal-effective">Last updated: October 31, 2026</p>

              <section>
                <h3>1. Introduction &amp; Scope</h3>
                <p>
                  This Privacy Policy explains how <strong>Lucky Sonker</strong> (&quot;I&quot;, &quot;me&quot;, or &quot;my&quot;) collects, uses, and protects information when you visit my personal developer portfolio website (<strong>https://luckysanker.dev/</strong>). I am committed to data minimization, privacy by design, and transparency.
                </p>
              </section>

              <section>
                <h3>2. Information We Collect</h3>
                <p>I collect only the minimum data required to communicate and maintain site security:</p>
                <ul>
                  <li>
                    <strong>Direct Inquiries:</strong> When you submit the contact form, I collect your <em>name</em>, <em>email address</em>, <em>project type/subject</em>, and <em>message</em>.
                  </li>
                  <li>
                    <strong>Anti-Spam &amp; Security:</strong> To prevent brute-force attacks and bot abuse, requests are rate-limited and logged with an anonymized IP address (the last network octet is stripped, e.g., <code>192.168.1.0</code>).
                  </li>
                  <li>
                    <strong>Anonymous Visit Metrics:</strong> A privacy-respecting counter records page visits and resume downloads. No cross-site tracking, advertising identifiers, or browser fingerprinting are used.
                  </li>
                </ul>
              </section>

              <section>
                <h3>3. Cookies &amp; Local Storage</h3>
                <p>
                  This website does <strong>not</strong> use third-party advertising or profiling cookies. The only client-side storage used is:
                </p>
                <ul>
                  <li><code>portfolio_theme</code>: Remembers your dark/light visual theme preference.</li>
                  <li><code>portfolio_cookie_consent</code>: Stores your cookie banner response.</li>
                  <li><code>portfolio_admin_token</code>: Stored strictly during authorized administrator sessions.</li>
                </ul>
              </section>

              <section>
                <h3>4. Data Storage &amp; Security</h3>
                <p>
                  All inquiries are saved in a secure, parameterized PostgreSQL database with strict transport security (TLS/HTTPS), rate-limiting, and sanitized inputs to prevent injection and data breaches. Your contact information is never sold, leased, or shared with advertisers.
                </p>
              </section>

              <section>
                <h3>5. Your Rights</h3>
                <p>
                  You have the right to request access to any personal message you have sent, request data correction, or request full deletion of your contact records from the database. To exercise your rights, email me directly at:{" "}
                  <a href="mailto:sonkerlucky5@gmail.com">sonkerlucky5@gmail.com</a>.
                </p>
              </section>
            </article>
          ) : (
            <article className="legal-doc">
              <h2>Terms &amp; Conditions</h2>
              <p className="legal-effective">Last updated: October 31, 2026</p>

              <section>
                <h3>1. Content Ownership &amp; Intellectual Property</h3>
                <p>
                  All content, text, graphics, designs, and brand representations on this portfolio are the intellectual property of <strong>Lucky Sonker</strong> unless otherwise stated. Projects showcased remain subject to their respective open-source or commercial licenses.
                </p>
              </section>

              <section>
                <h3>2. Permitted Use</h3>
                <p>
                  You are welcome to browse this portfolio, view open-source code repositories via the provided links, and contact me for job opportunities, consulting, or freelance engagements. You may not scrape this site maliciously, overload its APIs, or attempt unauthorized penetration of the administration portal.
                </p>
              </section>

              <section>
                <h3>3. Project Code &amp; Demos Disclaimer</h3>
                <p>
                  Demonstrations, code samples, and portfolio projects are provided &quot;as is&quot; for illustrative and portfolio evaluation purposes without warranty of any kind, either express or implied.
                </p>
              </section>

              <section>
                <h3>4. Limitation of Liability</h3>
                <p>
                  In no event shall the author be liable for any direct, indirect, incidental, or consequential damages arising from the use of or inability to use this website or external links provided herein.
                </p>
              </section>

              <section>
                <h3>5. Contact</h3>
                <p>
                  For questions concerning these terms, please contact:{" "}
                  <a href="mailto:sonkerlucky5@gmail.com">sonkerlucky5@gmail.com</a>.
                </p>
              </section>
            </article>
          )}
        </div>

        {/* Footer */}
        <div className="legal-modal-footer">
          <button type="button" className="btn btn-primary" onClick={onClose}>
            <CheckCircle2 size={16} /> I Understand
          </button>
        </div>
      </div>
    </div>
  );
};

export default LegalModal;

