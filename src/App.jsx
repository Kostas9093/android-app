// src/App.js
import  { useState, useEffect } from 'react';
import './App.css';
import MeasurementForm from './components/MeasurementForm';

function App() {
  const [progress, setProgress] = useState(null);

  const calculateProgress = (data) => {
    const weightDiff = (data.newWeight - data.oldWeight).toFixed(2);
    const fatDiff = (data.newFat - data.oldFat).toFixed(2);
    const muscleDiff = (data.newMuscle - data.oldMuscle).toFixed(2);
    const waterDiff = (data.newWater - data.oldWater).toFixed(2);

    const oldFatKilos = ((data.oldWeight * data.oldFat) / 100).toFixed(2);
    const newFatKilos = ((data.newWeight * data.newFat) / 100).toFixed(2);
    const oldMuscleKilos = ((data.oldWeight * data.oldMuscle) / 100).toFixed(2);
    const newMuscleKilos = ((data.newWeight * data.newMuscle) / 100).toFixed(2);

    setProgress({
      weightDiff,
      fatDiff,
      muscleDiff,
      waterDiff,
      oldFatKilos,
      newFatKilos,
      oldMuscleKilos,
      newMuscleKilos
    });
  };

  useEffect(() => {
    const savedMeasurements = JSON.parse(localStorage.getItem('oldMeasurements'));
    if (savedMeasurements) {
      setProgress({
        weightDiff: 0,
        fatDiff: 0,
        muscleDiff: 0,
        waterDiff: 0,
        oldFatKilos: ((savedMeasurements.oldWeight * savedMeasurements.oldFat) / 100).toFixed(2),
        newFatKilos: 0,
        oldMuscleKilos: ((savedMeasurements.oldWeight * savedMeasurements.oldMuscle) / 100).toFixed(2),
        newMuscleKilos: 0
      });
    }
  }, []);

  return (
    <div className="App">
      <h1>Weight Progress Tracker</h1>
      <MeasurementForm onCalculate={calculateProgress} />
    </div>
  );
}

export default App;
