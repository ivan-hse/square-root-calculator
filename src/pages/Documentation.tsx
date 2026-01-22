import { useI18n } from '../i18n/I18nContext';

export default function Documentation() {
  const { t } = useI18n();
  const sections = t.documentation.sections;

  return (
    <div className="documentation">
      <div className="card">
        <h2>{t.documentation.title}</h2>
      </div>

      <div className="doc-section card">
        <h3>{sections.overview.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.overview.content }}
        />
      </div>

      <div className="doc-section card">
        <h3>{sections.features.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.features.content }}
        />
      </div>

      <div className="doc-section card">
        <h3>{sections.modes.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.modes.content }}
        />
      </div>

      <div className="doc-section card">
        <h3>{sections.precision.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.precision.content }}
        />
      </div>

      <div className="doc-section card">
        <h3>{sections.examples.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.examples.content }}
        />
      </div>

      <div className="doc-section card">
        <h3>{sections.addingLanguage.title}</h3>
        <div
          className="doc-content"
          dangerouslySetInnerHTML={{ __html: sections.addingLanguage.content }}
        />
      </div>
    </div>
  );
}
