import PropTypes from 'prop-types';
import { useLanguage } from '../LanguageContext';

const WelcomePage = ({ onStart, onOpenCalculator, onOpenPhoto }) => {

 WelcomePage.propTypes = {
        onStart: PropTypes.func.isRequired, onOpenCalculator: PropTypes.func.isRequired, onOpenPhoto: PropTypes.func.isRequired
    };

  const { t, language, toggleLanguage } = useLanguage();

  return (
    <div className="welcome">
      <button
        className="language-toggle"
        onClick={toggleLanguage}
        aria-label="Switch language"
        title={language === 'en' ? 'Switch to Greek' : 'Αλλαγή σε Αγγλικά'}
      >
        <span className={language === 'en' ? 'lang-active' : 'lang-inactive'}>EN</span>
        <span className="lang-sep">|</span>
        <span className={language === 'el' ? 'lang-active' : 'lang-inactive'}>ΕΛ</span>
      </button>
      <h1>{t('appTitle')}</h1>
      <div className="start-box" onClick={onStart}>  {/* Step 1: Redirect to main app */}
        <h2>{t('registerWeight')}</h2>
      </div>
      <div className="calculator-box" onClick={onOpenCalculator}>
        <h2>{t('calculateBodyFat')}</h2>
      </div>
      <div className="calculator-box" onClick={onOpenPhoto} >
        <h2>{t('addPicture')}</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
