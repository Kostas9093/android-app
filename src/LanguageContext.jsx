import { createContext, useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Translation dictionary. Add new keys here and they become available
// everywhere via the useLanguage() hook. Use {value} placeholders for
// dynamic parts and pass a params object to t(): t('gainedWeight', { value: 2 }).
export const translations = {
  en: {
    // Homepage
    appTitle: 'Weight Progress Tracker',
    registerWeight: 'Register your weight & check your progress',
    calculateBodyFat: 'Calculate your body fat percentage with a fat calliper',
    addPicture: 'Add a picture of your progress',

    // Shared buttons / prompts
    back: 'Back',
    submit: 'Submit',
    exit: 'Exit',
    showHistory: 'Show History',
    clearLastEntry: 'Clear Last Entry',
    emailHistory: 'Email History',
    confirmExit: 'Are you sure you want to exit?',
    enterEmail: 'Enter your email:',

    // MeasurementForm - results
    progressResults: 'Progress Results',
    firstTimeEntry: 'First time entry — progress comparison will be available next time.',
    gainedWeight: 'You gained {value} kg',
    lostWeight: 'You lost {value} kg',
    noWeightChange: 'No weight change',
    gainedFat: 'You gained {value}% Fat Mass',
    lostFat: 'You lost {value}% Fat Mass',
    noFatChange: 'No Fat Mass change',
    kgOfFat: '{value} kg of Fat',
    gainedMuscle: 'You gained {value}% Muscle Mass',
    lostMuscle: 'You lost {value}% Muscle Mass',
    noMuscleChange: 'No Muscle Mass change',
    kgOfMuscle: '{value} kg of Muscle',
    gainedWater: 'You gained {value}% Water',
    lostWater: 'You lost {value}% Water',
    noWaterChange: 'No Water change',

    // MeasurementForm - form
    currentMeasurements: 'Current Measurements',
    phWeight: 'Current Weight Kg',
    phFat: 'Current Fat Mass %',
    phMuscle: 'Current Muscle Mass %',
    phWater: 'Current Water %',

    // HistoryPage
    measurementHistory: 'Measurement History',
    chartWeight: 'Weight (kg)',
    chartFat: 'Fat Mass (%)',
    chartMuscle: 'Muscle Mass (%)',
    chartWater: 'Water (%)',
    daysBetween: '{value} days between last measurement',
    labelWeight: 'Weight:',
    labelFat: 'Fat Mass:',
    labelMuscle: 'Muscle Mass:',
    labelWater: 'Water:',

    // Body Fat Calculator
    caliperTitle: 'Body Fat Calliper Calculator',
    gender: 'Gender:',
    select: 'Select',
    male: 'Male',
    female: 'Female',
    age: 'Age:',
    chest: 'Chest Skinfold (mm):',
    abdomen: 'Abdomen Skinfold (mm):',
    thigh: 'Thigh Skinfold (mm):',
    yourBodyFat: 'Your Body Fat Percentage:',
    bodyFatValue: '{value}%  Body Fat',
    bodyFatEntry: '{value}% Body Fat',
    daysSince: '{value} days since last measurement',

    // Body Fat History
    fatMeasurementHistory: 'Fat Measurement History',

    // Photo Progress
    photoProgress: 'Photo Progress',
    daySincePhoto: '{value} day since last photo',
    daysSincePhoto: '{value} days since last photo',
  },
  el: {
    // Homepage
    appTitle: 'Παρακολούθηση Προόδου Βάρους',
    registerWeight: 'Καταχώρησε το βάρος σου & δες την πρόοδό σου',
    calculateBodyFat: 'Υπολόγισε το ποσοστό λίπους με δερματοπτυχόμετρο',
    addPicture: 'Πρόσθεσε μια φωτογραφία της προόδου σου',

    // Shared buttons / prompts
    back: 'Πίσω',
    submit: 'Υποβολή',
    exit: 'Έξοδος',
    showHistory: 'Προβολή Ιστορικού',
    clearLastEntry: 'Διαγραφή Τελευταίας Καταχώρησης',
    emailHistory: 'Αποστολή Ιστορικού με Email',
    confirmExit: 'Είσαι σίγουρος ότι θέλεις να βγεις;',
    enterEmail: 'Εισήγαγε το email σου:',

    // MeasurementForm - results
    progressResults: 'Αποτελέσματα Προόδου',
    firstTimeEntry: 'Πρώτη καταχώρηση — η σύγκριση προόδου θα είναι διαθέσιμη την επόμενη φορά.',
    gainedWeight: 'Πήρες {value} κιλά',
    lostWeight: 'Έχασες {value} κιλά',
    noWeightChange: 'Καμία μεταβολή βάρους',
    gainedFat: 'Αύξησες {value}% Λιπώδη Μάζα',
    lostFat: 'Μείωσες {value}% Λιπώδη Μάζα',
    noFatChange: 'Καμία μεταβολή Λιπώδους Μάζας',
    kgOfFat: '{value} κιλά Λίπους',
    gainedMuscle: 'Αύξησες {value}% Μυϊκή Μάζα',
    lostMuscle: 'Μείωσες {value}% Μυϊκή Μάζα',
    noMuscleChange: 'Καμία μεταβολή Μυϊκής Μάζας',
    kgOfMuscle: '{value} κιλά Μυών',
    gainedWater: 'Αύξησες {value}% Νερό',
    lostWater: 'Μείωσες {value}% Νερό',
    noWaterChange: 'Καμία μεταβολή Νερού',

    // MeasurementForm - form
    currentMeasurements: 'Τρέχουσες Μετρήσεις',
    phWeight: 'Τρέχον Βάρος (κιλά)',
    phFat: 'Τρέχουσα Λιπώδης Μάζα %',
    phMuscle: 'Τρέχουσα Μυϊκή Μάζα %',
    phWater: 'Τρέχον Νερό %',

    // HistoryPage
    measurementHistory: 'Ιστορικό Μετρήσεων',
    chartWeight: 'Βάρος (κιλά)',
    chartFat: 'Λιπώδης Μάζα (%)',
    chartMuscle: 'Μυϊκή Μάζα (%)',
    chartWater: 'Νερό (%)',
    daysBetween: '{value} ημέρες από την τελευταία μέτρηση',
    labelWeight: 'Βάρος:',
    labelFat: 'Λιπώδης Μάζα:',
    labelMuscle: 'Μυϊκή Μάζα:',
    labelWater: 'Νερό:',

    // Body Fat Calculator
    caliperTitle: 'Υπολογισμός Λίπους με Δερματοπτυχόμετρο',
    gender: 'Φύλο:',
    select: 'Επιλογή',
    male: 'Άνδρας',
    female: 'Γυναίκα',
    age: 'Ηλικία:',
    chest: 'Δερματοπτυχή Στήθους (mm):',
    abdomen: 'Δερματοπτυχή Κοιλιάς (mm):',
    thigh: 'Δερματοπτυχή Μηρού (mm):',
    yourBodyFat: 'Το Ποσοστό Λίπους σου:',
    bodyFatValue: '{value}%  Λίπος Σώματος',
    bodyFatEntry: '{value}% Λίπος Σώματος',
    daysSince: '{value} ημέρες από την τελευταία μέτρηση',

    // Body Fat History
    fatMeasurementHistory: 'Ιστορικό Μετρήσεων Λίπους',

    // Photo Progress
    photoProgress: 'Φωτογραφική Πρόοδος',
    daySincePhoto: '{value} ημέρα από την τελευταία φωτογραφία',
    daysSincePhoto: '{value} ημέρες από την τελευταία φωτογραφία',
  },
};

const LanguageContext = createContext(null);

const interpolate = (str, params) => {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (match, key) =>
    Object.prototype.hasOwnProperty.call(params, key) ? String(params[key]) : match
  );
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    // Persist the user's choice across reloads.
    return localStorage.getItem('appLanguage') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('appLanguage', language);
    document.documentElement.lang = language;
  }, [language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'el' : 'en'));
  };

  // t() looks up a key for the current language, falling back to English,
  // and interpolates {value}-style placeholders from the optional params.
  const t = (key, params) => {
    const template = translations[language]?.[key] ?? translations.en[key] ?? key;
    return interpolate(template, params);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

LanguageProvider.propTypes = {
  children: PropTypes.node,
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
