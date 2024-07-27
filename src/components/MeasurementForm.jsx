import  { useState, useEffect } from 'react';

const ProgressDisplay = ({ progress }) => {
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
      <p>{weightDiff >= 0 ? `You gained ${weightDiff} kg` : `You lost ${Math.abs(weightDiff).toFixed(2)} kg`}</p>
      <p>{fatDiff >= 0 ? `You gained ${Math.abs(fatDiff).toFixed(2)} % of Fat Mass` : `You lost ${Math.abs(fatDiff).toFixed(2)}% of Fat Mass`}</p>
      <p> which is {fatKilosDiff >= 0 ? ` ${Math.abs(fatKilosDiff).toFixed(2)} kilos of Fat` : ` ${Math.abs(fatKilosDiff).toFixed(2)} kilos of Fat`}</p>
      <p>{muscleDiff >= 0 ? `You gained ${Math.abs(muscleDiff).toFixed(2)} % of Muscle Mass` : `You lost ${Math.abs(muscleDiff).toFixed(2)}% of Muscle Mass`}</p>
      <p> which is {musleKilosDiff >= 0 ? ` ${Math.abs(musleKilosDiff).toFixed(2)} kilos of Muscles` : ` ${Math.abs(musleKilosDiff).toFixed(2)} kilos of Muscles`}</p>
      <p>{waterDiff >=0 ? `You gained ${Math.abs(waterDiff).toFixed(2)} % of Water` : `You Lost ${Math.abs(waterDiff).toFixed(2)} % of Water`}</p>
      <p>which is {Math.abs(waterDiff * 1).toFixed(2)} kilos of Water</p>
    </div>
  );
};

const MeasurementForm = () => {
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

  const handleChange = (e, type, isOld = true) => {
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

    // Update the measurement history
    const newHistoryEntry = {
      date: new Date().toISOString().split('T')[0], // Formatting the date to YYYY-MM-DD,
      measurements: newMeasurements
    };
    

    const updatedHistory = [...measurementHistory, newHistoryEntry];
    setMeasurementHistory(updatedHistory);
    localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));

    // Update the old measurements to the new ones
    localStorage.setItem('oldMeasurements', JSON.stringify(newMeasurements));
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Old Measurements</h2>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            placeholder="Enter Your Previous Weight in kg"
            name="weight"
            value={oldMeasurements.weight}
            onChange={(e) => handleChange(e, 'weight')}
          />
        </div>
        <div>
          <label>Fat Mass (%):</label>
          <input
            type="number"
            placeholder="Enter Your Previous Fat Mass in %"
            name="fat"
            value={oldMeasurements.fat}
            onChange={(e) => handleChange(e, 'fat')}
          />
        </div>
        <div>
          <label>Muscle Mass (%):</label>
          <input
            type="number"
            placeholder="Enter Your Previous Muscle Mass in %"
            name="muscle"
            value={oldMeasurements.muscle}
            onChange={(e) => handleChange(e, 'muscle')}
          />
        </div>
        <div>
          <label>Water (%):</label>
          <input
            type="number"
            placeholder="Enter Your Previous Water in %"
            name="water"
            value={oldMeasurements.water}
            onChange={(e) => handleChange(e, 'water')}
          />
        </div>

        <h2>New Measurements</h2>
        <div>
          <label>Weight (kg):</label>
          <input
            type="number"
            placeholder="Enter Your Current Weight in kg"
            name="weight"
            value={newMeasurements.weight}
            onChange={(e) => handleChange(e, 'weight', false)}
          />
        </div>
        <div>
          <label>Fat Mass (%):</label>
          <input
            type="number"
            placeholder="Enter Your Current Fat Mass in %"
            name="fat"
            value={newMeasurements.fat}
            onChange={(e) => handleChange(e, 'fat', false)}
          />
        </div>
        <div>
          <label>Muscle Mass (%):</label>
          <input
            type="number"
            placeholder="Enter Your Current Muscle Mass %"
            name="muscle"
            value={newMeasurements.muscle}
            onChange={(e) => handleChange(e, 'muscle', false)}
          />
        </div>
        <div>
          <label>Water (%):</label>
          <input
            type="number"
            placeholder="Enter Your Current Water in %"
            name="water"
            value={newMeasurements.water}
            onChange={(e) => handleChange(e, 'water', false)}
          />
        </div>
        <button id='compare' type="submit">Compare</button>
      </form>

      <ProgressDisplay progress={progress} />

      <h2>Measurement History</h2>
      <ul id='history'>
        {measurementHistory.map((entry, index) => (
          <li key={index}>
            {entry.date} Weight: {entry.measurements.weight}kg, FM: {entry.measurements.fat}%, MM: {entry.measurements.muscle}%, Water: {entry.measurements.water}%
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MeasurementForm;
