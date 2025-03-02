import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

// Component to display progress results
const ProgressDisplay = ({ progress, onBackToMain }) => {
  if (!progress) return null;

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
      <p>{weightDiff > 0 ? `You gained ${weightDiff} kg` : weightDiff < 0 ? `You lost ${Math.abs(weightDiff).toFixed(2)} kg` : `${Math.abs(weightDiff).toFixed(2)} kg`}</p>
      <p>{fatDiff > 0 ? `You gained ${Math.abs(fatDiff).toFixed(2)} % of Fat Mass` : fatDiff < 0 ? `You lost ${Math.abs(fatDiff).toFixed(2)}% of Fat Mass` : `${Math.abs(fatDiff).toFixed(2)}% of Fat Mass`} which is {fatKilosDiff > 0 ?  `${Math.abs(fatKilosDiff).toFixed(2)} kilos of Fat` :  `${Math.abs(fatKilosDiff).toFixed(2)} kilos of Fat`}</p>
      <p>{muscleDiff > 0 ? `You gained ${Math.abs(muscleDiff).toFixed(2)} % of Muscle Mass` : muscleDiff < 0 ? `You lost ${Math.abs(muscleDiff).toFixed(2)}% of Muscle Mass` : `${Math.abs(muscleDiff).toFixed(2)}% of Muscle Mass`} which is {musleKilosDiff > 0 ?  `${Math.abs(musleKilosDiff).toFixed(2)} kilos of Muscles` :  `${Math.abs(musleKilosDiff).toFixed(2)} kilos of Muscles`}</p>
      <p>{waterDiff > 0 ? `You gained ${Math.abs(waterDiff).toFixed(2)} % of Water` : waterDiff < 0 ? `You Lost ${Math.abs(waterDiff).toFixed(2)} % of Water` : `${Math.abs(waterDiff).toFixed(2)}`} which is {Math.abs(waterDiff / 100 * 100).toFixed(2)} kilos of Water</p>
      <button id='back' onClick={onBackToMain}>Back to Main</button>
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
  onBackToMain: PropTypes.func.isRequired, // Back to main function prop
  
};

const MeasurementForm = ({ onShowHistory, onBackToMain, showResults, setShowResults }) => {
  const [oldMeasurements, setOldMeasurements] = useState({
    weight: '',
    fat: '',
    muscle: '',
    water: ''
  });

  const [newMeasurements, setNewMeasurements] = useState({
    weight: '',
    fat: '',
    muscle: '',
    water: ''
  });

  const [progress, setProgress] = useState(null);
  const [measurementHistory, setMeasurementHistory] = useState([]);


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

  const handleChange = (e, isOld = true) => {
    const { name, value } = e.target;
    if (isOld) {
      setOldMeasurements(prevState => ({
        ...prevState,
        [name]: value
      }));
    } else {
      setNewMeasurements(prevState => ({
        ...prevState,
        [name]: value
      }));
    }
  };
// PropTypes validation for MeasurementForm component
MeasurementForm.propTypes = {
  onShowHistory: PropTypes.func.isRequired,
  onBackToMain: PropTypes.func.isRequired,
  showResults: PropTypes.bool.isRequired,    // showResults is expected to be a boolean
  setShowResults: PropTypes.func.isRequired, // setShowResults is a function
};
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
      musleKilosDiff: newMuscleKilos - oldMuscleKilos
    };

    setProgress(progress);
    setShowResults(true);  // Show results and hide the form

    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0],
      measurements: newMeasurements
    };

    const updatedHistory = [...measurementHistory, newHistoryEntry];
    setMeasurementHistory(updatedHistory);
    localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));
    localStorage.setItem('oldMeasurements', JSON.stringify(newMeasurements));
  };

  const handleExit = () => {
    if (window.confirm("DO YOU REALLY WANT TO CLOSE?")) {
      document.addEventListener("visibilitychange", function () {
        if (document.hidden) {
          window.history.back();
        }
      });
    }
  };
  

  return (
    <div id="mform">
      <h1>Weight Progress Tracker</h1>
      <br/>
      {!showResults ? (
        <form onSubmit={handleSubmit}>
          <h2>Last Measurements</h2>
          <input
            type="number"
            placeholder="Previous Weight Kg"
            name="weight"
            value={oldMeasurements.weight}
            onChange={(e) => handleChange(e, true)}
          />
          <input
            type="number"
            placeholder="Previous Fat Mass %"
            name="fat"
            value={oldMeasurements.fat}
            onChange={(e) => handleChange(e, true)}
          />
          <input
            type="number"
            placeholder="Previous Muscle Mass %"
            name="muscle"
            value={oldMeasurements.muscle}
            onChange={(e) => handleChange(e, true)}
          />
          <input
            type="number"
            placeholder="Previous Water %"
            name="water"
            value={oldMeasurements.water}
            onChange={(e) => handleChange(e, true)}
          />

          <h2>Current Measurements</h2>
          <input
            type="number"
            placeholder="Current Weight Kg"
            name="weight"
            value={newMeasurements.weight}
            onChange={(e) => handleChange(e, false)}
          />
          <input
            type="number"
            placeholder="Current Fat Mass %"
            name="fat"
            value={newMeasurements.fat}
            onChange={(e) => handleChange(e, false)}
          />
          <input
            type="number"
            placeholder="Current Muscle Mass %"
            name="muscle"
            value={newMeasurements.muscle}
            onChange={(e) => handleChange(e, false)}
          />
          <input
            type="number"
            placeholder="Current Water %"
            name="water"
            value={newMeasurements.water}
            onChange={(e) => handleChange(e, false)}
          />

          <button id="compare" type="submit">Compare</button>
          <button id="back" onClick={onBackToMain}>Back</button>
        </form>
      ) : (
        <ProgressDisplay progress={progress} onBackToMain={onBackToMain} />
        
      )}
      <button id="exit" onClick={handleExit}>Exit</button>
      <button id="showHistory" onClick={onShowHistory}>Show History</button>
      
    </div>
  );
};

export default MeasurementForm;
