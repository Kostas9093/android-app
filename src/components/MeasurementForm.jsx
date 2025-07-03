import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const ProgressDisplay = ({ progress, onBackToMain }) => {
  if (!progress) return null;

  if (progress.firstTime) {
    return (
      <div className="new">
        <h2>Progress Results</h2>
        <p>First time entry — progress comparison will be available next time.</p>
        <button id='back' onClick={onBackToMain}>Back</button>
      </div>
    );
  }

  const { weightDiff, fatDiff, muscleDiff, waterDiff, musleKilosDiff, fatKilosDiff } = progress;

  return (
    <div className="new">
      <h2>Progress Results</h2>
      <p>{weightDiff > 0 ? `You gained ${weightDiff} kg` : weightDiff < 0 ? `You lost ${Math.abs(weightDiff).toFixed(2)} kg` : `No weight change`}</p>
      <p>{fatDiff > 0 ? `You gained ${Math.abs(fatDiff).toFixed(2)}% Fat Mass` : fatDiff < 0 ? `You lost ${Math.abs(fatDiff).toFixed(2)}% Fat Mass` : `No Fat Mass change`} ({Math.abs(fatKilosDiff).toFixed(2)} kg of Fat)</p>
      <p>{muscleDiff > 0 ? `You gained ${Math.abs(muscleDiff).toFixed(2)}% Muscle Mass` : muscleDiff < 0 ? `You lost ${Math.abs(muscleDiff).toFixed(2)}% Muscle Mass` : `No Muscle Mass change`} ({Math.abs(musleKilosDiff).toFixed(2)} kg of Muscle)</p>
      <p>{waterDiff > 0 ? `You gained ${Math.abs(waterDiff).toFixed(2)}% Water` : waterDiff < 0 ? `You lost ${Math.abs(waterDiff).toFixed(2)}% Water` : `No Water change`}</p>
      <button id='back' onClick={onBackToMain}>Back</button>
    </div>
  );
};

ProgressDisplay.propTypes = {
  progress: PropTypes.object,
  onBackToMain: PropTypes.func.isRequired,
};

const MeasurementForm = ({ onShowHistory, onBackToMain, showResults, setShowResults }) => {
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
    if (window.confirm("Are you sure you want to exit?")) {
      window.close();
    }
  };

  return (
    <div id="mform">
      <h1>Weight Progress Tracker</h1>
      <br />
      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <h2>Current Measurements</h2>
          <input type="number" placeholder="Current Weight Kg" name="weight" value={newMeasurements.weight} onChange={handleChange} />
          <input type="number" placeholder="Current Fat Mass %" name="fat" value={newMeasurements.fat} onChange={handleChange} />
          <input type="number" placeholder="Current Muscle Mass %" name="muscle" value={newMeasurements.muscle} onChange={handleChange} />
          <input type="number" placeholder="Current Water %" name="water" value={newMeasurements.water} onChange={handleChange} />
          <button id="back" onClick={onBackToMain}>Back</button>
          <button id="compare" type="submit">Submit</button>
        </form>
      ) : (
        <ProgressDisplay progress={progress} onBackToMain={onBackToMain} />
      )}
      <button id="exit" onClick={handleExit}>Exit</button>
      <button id="showHistory" onClick={onShowHistory}>Show History</button>
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
