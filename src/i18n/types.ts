export interface Translations {
  app: {
    title: string;
    nav: {
      calculator: string;
      documentation: string;
      support: string;
    };
    footer: string;
  };
  calculator: {
    title: string;
    inputLabel: string;
    inputPlaceholder: string;
    precisionLabel: string;
    calculateButton: string;
    result: string;
    realPart: string;
    imaginaryPart: string;
    modes: {
      real: string;
      complex: string;
      arbitrary: string;
      analytical: string;
    };
    modeLabel: string;
    hints: {
      real: string;
      complex: string;
      arbitrary: string;
      analytical: string;
    };
    errors: {
      invalidInput: string;
      negativeReal: string;
      emptyInput: string;
      invalidExpression: string;
    };
  };
  documentation: {
    title: string;
    sections: {
      overview: { title: string; content: string };
      features: { title: string; content: string };
      modes: { title: string; content: string };
      precision: { title: string; content: string };
      examples: { title: string; content: string };
      addingLanguage: { title: string; content: string };
    };
  };
  support: {
    title: string;
    faq: {
      title: string;
      items: Array<{ question: string; answer: string }>;
    };
    contact: {
      title: string;
      description: string;
      nameLabel: string;
      emailLabel: string;
      messageLabel: string;
      submitButton: string;
      successMessage: string;
    };
  };
  common: {
    loading: string;
    error: string;
    close: string;
    submit: string;
    cancel: string;
    language: string;
    addLanguage: string;
  };
  modal: {
    addLanguage: {
      title: string;
      codeLabel: string;
      codePlaceholder: string;
      nameLabel: string;
      namePlaceholder: string;
      nativeNameLabel: string;
      nativeNamePlaceholder: string;
      jsonLabel: string;
      jsonPlaceholder: string;
      errors: {
        allFieldsRequired: string;
        invalidStructure: string;
        invalidJson: string;
      };
    };
  };
}

export interface LanguageInfo {
  code: string;
  name: string;
  nativeName: string;
}
