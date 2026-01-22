import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';

export default function Support() {
  const { t } = useI18n();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [contactForm, setContactForm] = useState({ name: '', message: '' });
  const [messageSent, setMessageSent] = useState(false);

  const toggleFaq = (index: number) => {
    setExpandedFaq(expandedFaq === index ? null : index);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const subject = encodeURIComponent(
      `Support Request from ${contactForm.name}`
    );
    const body = encodeURIComponent(
      `Name: ${contactForm.name}\n\nMessage:\n${contactForm.message}`
    );

    window.location.href = `mailto:${import.meta.env.VITE_SUPPORT_EMAIL}?subject=${subject}&body=${body}`;

    setMessageSent(true);
    setContactForm({ name: '', message: '' });
    setTimeout(() => setMessageSent(false), 5000);
  };

  return (
    <div className="support">
      {/* FAQ Section */}
      <div className="card">
        <h2>{t.support.faq.title}</h2>
        <div className="faq-list">
          {t.support.faq.items.map((item, index) => (
            <div
              key={index}
              className={`faq-item ${expandedFaq === index ? 'expanded' : ''}`}
              onClick={() => toggleFaq(index)}
            >
              <h4>{item.question}</h4>
              <p>{item.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Form */}
      <div className="card">
        <h2>{t.support.contact.title}</h2>
        <p style={{ marginBottom: '1rem', color: 'var(--text-muted)' }}>
          {t.support.contact.description}
        </p>

        {messageSent ? (
          <div className="success-message">
            {t.support.contact.successMessage}
          </div>
        ) : (
          <form className="contact-form" onSubmit={handleContactSubmit}>
            <input
              type="text"
              placeholder={t.support.contact.nameLabel}
              value={contactForm.name}
              onChange={(e) =>
                setContactForm({ ...contactForm, name: e.target.value })
              }
              required
            />
            <textarea
              placeholder={t.support.contact.messageLabel}
              value={contactForm.message}
              onChange={(e) =>
                setContactForm({ ...contactForm, message: e.target.value })
              }
              required
            />
            <button type="submit">{t.support.contact.submitButton}</button>
          </form>
        )}
      </div>
    </div>
  );
}
