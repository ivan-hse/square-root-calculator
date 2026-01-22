import { useState } from 'react';
import { useI18n } from '../i18n/I18nContext';
import AddLanguageModal from './AddLanguageModal';

export default function LanguageSelector() {
  const { t, currentLanguage, availableLanguages, setLanguage } = useI18n();
  const [showModal, setShowModal] = useState(false);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="language-selector">
      <label htmlFor="language-select">{t.common.language}:</label>
      <select
        id="language-select"
        value={currentLanguage}
        onChange={handleLanguageChange}
      >
        {availableLanguages.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.nativeName} ({lang.name})
          </option>
        ))}
      </select>
      <button
        className="add-language-btn"
        onClick={() => setShowModal(true)}
        title={t.common.addLanguage}
      >
        +
      </button>
      {showModal && <AddLanguageModal onClose={() => setShowModal(false)} />}
    </div>
  );
}
