import  { useState, useEffect } from 'react';

const HistoryPage = ({ onBack }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('measurementHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // Function to handle clearing the last entry from history
  const handleClearHistory = () => {
    if (history.length > 0) {
      const updatedHistory = history.slice(0, -1); // Remove the last entry
      setHistory(updatedHistory);
      localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));
    }
  };

  return (
    <div>
      <h2>Measurement History</h2>
      <ul>
        {history.map((entry, index) => (
          <li id='history' key={index}>
             <span className="date">{entry.date}</span>  Weight: {entry.measurements.weight}kg, Fat Mass: {entry.measurements.fat}%, Muscle Mass: {entry.measurements.muscle}%, Water: {entry.measurements.water}%
      </li>
        ))}
      </ul>

      <button id='back' onClick={onBack}>Back to Main</button>  {/* Back to main app */}
      {history.length > 0 && (
        <button id='clear' onClick={handleClearHistory}>Clear Last Entry</button>  /* Clear last history entry */
      )}
    </div>
  );
};

export default HistoryPage;
