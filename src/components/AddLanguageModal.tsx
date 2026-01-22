import { useState, useCallback } from 'react';
import { useI18n } from '../i18n/I18nContext';
import { Translations } from '../i18n/types';

interface AddLanguageModalProps {
  onClose: () => void;
}

export default function AddLanguageModal({ onClose }: AddLanguageModalProps) {
  const { t, addLanguage, setLanguage } = useI18n();
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [nativeName, setNativeName] = useState('');
  const [jsonContent, setJsonContent] = useState('');
  const [error, setError] = useState('');
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!code || !name || !nativeName || !jsonContent) {
      setError(t.modal.addLanguage.errors.allFieldsRequired);
      return;
    }

    try {
      const translations: Translations = JSON.parse(jsonContent);

      if (
        !translations.app ||
        !translations.calculator ||
        !translations.common
      ) {
        setError(t.modal.addLanguage.errors.invalidStructure);
        return;
      }

      addLanguage({ code, name, nativeName }, translations);
      setLanguage(code);
      handleClose();
    } catch {
      setError(t.modal.addLanguage.errors.invalidJson);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  return (
    <div
      className={`modal-overlay ${isClosing ? 'closing' : ''}`}
      onClick={handleOverlayClick}
    >
      <div className="modal">
        <h3>{t.modal.addLanguage.title}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="lang-code">{t.modal.addLanguage.codeLabel}</label>
            <input
              id="lang-code"
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toLowerCase())}
              placeholder={t.modal.addLanguage.codePlaceholder}
              maxLength={5}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lang-name">{t.modal.addLanguage.nameLabel}</label>
            <input
              id="lang-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.modal.addLanguage.namePlaceholder}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lang-native">
              {t.modal.addLanguage.nativeNameLabel}
            </label>
            <input
              id="lang-native"
              type="text"
              value={nativeName}
              onChange={(e) => setNativeName(e.target.value)}
              placeholder={t.modal.addLanguage.nativeNamePlaceholder}
            />
          </div>
          <div className="form-group">
            <label htmlFor="lang-json">{t.modal.addLanguage.jsonLabel}</label>
            <textarea
              id="lang-json"
              value={jsonContent}
              onChange={(e) => setJsonContent(e.target.value)}
              placeholder={t.modal.addLanguage.jsonPlaceholder}
              style={{ minHeight: '200px', fontFamily: 'monospace' }}
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <div className="modal-actions">
            <button type="button" className="cancel-btn" onClick={handleClose}>
              {t.common.cancel}
            </button>
            <button type="submit" className="submit-btn">
              {t.common.submit}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
