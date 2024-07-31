import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component to display progress results
const ProgressDisplay = ({ progress }) => {
  if (!progress) return null; // Return nothing if there's no progress to display

  const {
    weightDiff,
    fatDiff,
    muscleDiff,
    waterDiff,
    musleKilosDiff,
    fatKilosDiff,
  } = progress;

  return (
    <div className="new">
      <h2>Progress Results</h2>
      <p>{weightDiff >= 0 ? `You gained ${weightDiff} kg` : `You lost ${Math.abs(weightDiff).toFixed(2)} kg`}</p>
      <p>
        {fatDiff >= 0 ? `You gained ${Math.abs(fatDiff).toFixed(2)} % of Fat Mass` : `You lost ${Math.abs(fatDiff).toFixed(2)}% of Fat Mass`} which is {Math.abs(fatKilosDiff).toFixed(2)} kilos of Fat
      </p>
      <p>
        {muscleDiff >= 0 ? `You gained ${Math.abs(muscleDiff).toFixed(2)} % of Muscle Mass` : `You lost ${Math.abs(muscleDiff).toFixed(2)}% of Muscle Mass`} which is {Math.abs(musleKilosDiff).toFixed(2)} kilos of Muscles
      </p>
      <p>
        {waterDiff >= 0 ? `You gained ${Math.abs(waterDiff).toFixed(2)} % of Water` : `You Lost ${Math.abs(waterDiff).toFixed(2)} % of Water`} which is {Math.abs(waterDiff * 1).toFixed(2)} kilos of Water
      </p>
    </div>
  );
};

// Define prop types for the ProgressDisplay component
ProgressDisplay.propTypes = {
  progress: PropTypes.shape({
    weightDiff: PropTypes.number,
    fatDiff: PropTypes.number,
    muscleDiff: PropTypes.number,
    waterDiff: PropTypes.number,
    musleKilosDiff: PropTypes.number,
    fatKilosDiff: PropTypes.number,
  }),
};
const MeasurementForm = () => {
  const [oldMeasurements, setOldMeasurements] = useState({
    weight: '',
    fat: '',
    muscle: '',
    water: '',
  });

  const [newMeasurements, setNewMeasurements] = useState({
    weight: '',
    fat: '',
    muscle: '',
    water: '',
  });

  const [progress, setProgress] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState([]);

  // Load saved data from localStorage on component mount
  useEffect(() => {
    const savedOldMeasurements = JSON.parse(localStorage.getItem('oldMeasurements'));
    if (savedOldMeasurements) {
      setOldMeasurements(savedOldMeasurements);
    }

    const savedMeasurementHistory = JSON.parse(localStorage.getItem('measurementHistory'));
    if (savedMeasurementHistory) {
      setMeasurementHistory(savedMeasurementHistory);
    }
  }, []);

  // Handle changes in form inputs
  const handleChange = (e, isOld = true) => {
    const { name, value } = e.target;
    const setMeasurements = isOld ? setOldMeasurements : setNewMeasurements;
    setMeasurements((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const oldFatKilos = (oldMeasurements.weight * oldMeasurements.fat) / 100;
    const newFatKilos = (newMeasurements.weight * newMeasurements.fat) / 100;
    const oldMuscleKilos = (oldMeasurements.weight * oldMeasurements.muscle) / 100;
    const newMuscleKilos = (newMeasurements.weight * newMeasurements.muscle) / 100;

    const progress = {
      weightDiff: newMeasurements.weight - oldMeasurements.weight,
      fatDiff: newMeasurements.fat - oldMeasurements.fat,
      muscleDiff: newMeasurements.muscle - oldMeasurements.muscle,
      waterDiff: newMeasurements.water - oldMeasurements.water,
      fatKilosDiff: newFatKilos - oldFatKilos,
      musleKilosDiff: newMuscleKilos - oldMuscleKilos,
    };

    setProgress(progress);

    // Update the measurement history
    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0], // Formatting the date to YYYY-MM-DD
      measurements: newMeasurements,
    };

    const updatedHistory = [...measurementHistory, newHistoryEntry];
    setMeasurementHistory(updatedHistory);
    localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));

    // Update the old measurements to the new ones
    localStorage.setItem('oldMeasurements', JSON.stringify(newMeasurements));
  };

  // Clear measurement history and old measurements
  const handleClearHistory = () => {
    setMeasurementHistory([]);
    localStorage.removeItem('measurementHistory');
    localStorage.removeItem('oldMeasurements');
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Latest Measurements</h2>
        {['weight', 'fat', 'muscle', 'water'].map((key) => (
          <div key={key}>
            <label>{`${key.charAt(0).toUpperCase() + key.slice(1)} (kg):`}</label>
            <input
              type="number"
              placeholder={`Enter Your Previous ${key.charAt(0).toUpperCase() + key.slice(1)} in %`}
              name={key}
              value={oldMeasurements[key]}
              onChange={(e) => handleChange(e, true)}
            />
          </div>
        ))}

        <h2>Current Measurements</h2>
        {['weight', 'fat', 'muscle', 'water'].map((key) => (
          <div key={key}>
            <label>{`${key.charAt(0).toUpperCase() + key.slice(1)} (kg):`}</label>
            <input
              type="number"
              placeholder={`Enter Your Current ${key.charAt(0).toUpperCase() + key.slice(1)} in %`}
              name={key}
              value={newMeasurements[key]}
              onChange={(e) => handleChange(e, false)}
            />
          </div>
        ))}
        <button id='compare' type="submit">Compare</button>
      </form>

      <ProgressDisplay progress={progress} />

      <h2>Measurements History</h2>
      <ul id='history'>
        {measurementHistory.map((entry, index) => (
          <li key={index}>
            {entry.date} Weight: {entry.measurements.weight}kg, FM: {entry.measurements.fat}%, MM: {entry.measurements.muscle}%, Water: {entry.measurements.water}%
          </li>
        ))}
      </ul>
      {measurementHistory.length > 0 && (
        <button id='clear' onClick={handleClearHistory}>Clear History</button>
      )}
    </div>
  );
};

export default MeasurementForm;
