import { Routes, Route } from 'react-router-dom';
import { useI18n } from './i18n/I18nContext';
import Header from './components/Header';
import Calculator from './pages/Calculator';
import Documentation from './pages/Documentation';
import Support from './pages/Support';

function App() {
  const { t, isLoading } = useI18n();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>{t.common.loading}</p>
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Calculator />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/support" element={<Support />} />
        </Routes>
      </main>
      <footer className="footer">
        <p>{t.app.footer}</p>
      </footer>
    </div>
  );
}

export default App;
