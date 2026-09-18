import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useLanguage } from '../LanguageContext';

const ProgressDisplay = ({ progress, onBackToMain }) => {
  const { t } = useLanguage();

  if (!progress) return null;

  if (progress.firstTime) {
    return (
      <div className="new">
        <h2>{t('progressResults')}</h2>
        <p>{t('firstTimeEntry')}</p>
        <button id='back' onClick={onBackToMain}>{t('back')}</button>
      </div>
    );
  }

  const { weightDiff, fatDiff, muscleDiff, waterDiff, musleKilosDiff, fatKilosDiff } = progress;

  return (
    <div className="new">
      <h2>{t('progressResults')}</h2>
      <p>{weightDiff > 0 ? t('gainedWeight', { value: weightDiff }) : weightDiff < 0 ? t('lostWeight', { value: Math.abs(weightDiff).toFixed(2) }) : t('noWeightChange')}</p>
      <p>{fatDiff > 0 ? t('gainedFat', { value: Math.abs(fatDiff).toFixed(2) }) : fatDiff < 0 ? t('lostFat', { value: Math.abs(fatDiff).toFixed(2) }) : t('noFatChange')} ({t('kgOfFat', { value: Math.abs(fatKilosDiff).toFixed(2) })})</p>
      <p>{muscleDiff > 0 ? t('gainedMuscle', { value: Math.abs(muscleDiff).toFixed(2) }) : muscleDiff < 0 ? t('lostMuscle', { value: Math.abs(muscleDiff).toFixed(2) }) : t('noMuscleChange')} ({t('kgOfMuscle', { value: Math.abs(musleKilosDiff).toFixed(2) })})</p>
      <p>{waterDiff > 0 ? t('gainedWater', { value: Math.abs(waterDiff).toFixed(2) }) : waterDiff < 0 ? t('lostWater', { value: Math.abs(waterDiff).toFixed(2) }) : t('noWaterChange')}</p>
      <button id='back' onClick={onBackToMain}>{t('back')}</button>
    </div>
  );
};

ProgressDisplay.propTypes = {
  progress: PropTypes.object,
  onBackToMain: PropTypes.func.isRequired,
};

const MeasurementForm = ({ onShowHistory, onBackToMain, showResults, setShowResults }) => {
  const { t } = useLanguage();
  const [newMeasurements, setNewMeasurements] = useState({ weight: '', fat: '', muscle: '', water: '' });
  const [progress, setProgress] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState([]);

  useEffect(() => {
    const savedMeasurementHistory = JSON.parse(localStorage.getItem('measurementHistory'));
    if (savedMeasurementHistory) {
      setMeasurementHistory(savedMeasurementHistory);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewMeasurements(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const oldMeasurements = JSON.parse(localStorage.getItem('oldMeasurements'));
    const oldWeight = oldMeasurements ? parseFloat(oldMeasurements.weight) : null;
    const newWeight = parseFloat(newMeasurements.weight);
    const oldFat = oldMeasurements ? parseFloat(oldMeasurements.fat) : null;
    const newFat = parseFloat(newMeasurements.fat);
    const oldMuscle = oldMeasurements ? parseFloat(oldMeasurements.muscle) : null;
    const newMuscle = parseFloat(newMeasurements.muscle);
    const oldWater = oldMeasurements ? parseFloat(oldMeasurements.water) : null;
    const newWater = parseFloat(newMeasurements.water);

    if (oldMeasurements) {
      const oldFatKilos = (oldWeight * oldFat) / 100;
      const newFatKilos = (newWeight * newFat) / 100;
      const oldMuscleKilos = (oldWeight * oldMuscle) / 100;
      const newMuscleKilos = (newWeight * newMuscle) / 100;

      const progress = {
        weightDiff: newWeight - oldWeight,
        fatDiff: newFat - oldFat,
        muscleDiff: newMuscle - oldMuscle,
        waterDiff: newWater - oldWater,
        fatKilosDiff: newFatKilos - oldFatKilos,
        musleKilosDiff: newMuscleKilos - oldMuscleKilos,
        firstTime: false,
      };

      setProgress(progress);
    } else {
      setProgress({ firstTime: true });
    }

    setShowResults(true);

    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      measurements: newMeasurements,
    };

    const updatedHistory = [...measurementHistory, newHistoryEntry];
    setMeasurementHistory(updatedHistory);
    localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('oldMeasurements', JSON.stringify(newMeasurements));
  };

  const handleExit = () => {
    if (window.confirm(t('confirmExit'))) {
      window.close();
    }
  };

  return (
    <div id="mform">
      <h1>{t('appTitle')}</h1>
      <br />
      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <h2>{t('currentMeasurements')}</h2>
          <input type="number" placeholder={t('phWeight')} name="weight" value={newMeasurements.weight} onChange={handleChange} />
          <input type="number" placeholder={t('phFat')} name="fat" value={newMeasurements.fat} onChange={handleChange} />
          <input type="number" placeholder={t('phMuscle')} name="muscle" value={newMeasurements.muscle} onChange={handleChange} />
          <input type="number" placeholder={t('phWater')} name="water" value={newMeasurements.water} onChange={handleChange} />
          <button id="back" onClick={onBackToMain}>{t('back')}</button>
          <button id="compare" type="submit">{t('submit')}</button>
        </form>
      ) : (
        <ProgressDisplay progress={progress} onBackToMain={onBackToMain} />
      )}
      <button id="exit" onClick={handleExit}>{t('exit')}</button>
      <button id="showHistory" onClick={onShowHistory}>{t('showHistory')}</button>
    </div>
  );
};

MeasurementForm.propTypes = {
  onShowHistory: PropTypes.func.isRequired,
  onBackToMain: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,
  setShowResults: PropTypes.func.isRequired,
};

export default MeasurementForm;
