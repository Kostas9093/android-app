import { useState, useEffect } from 'react';

const HistoryPage = ({ onBack }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('measurementHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleClearHistory = () => {
    if (history.length > 0) {
      const updatedHistory = history.slice(0, -1);
      setHistory(updatedHistory);
      localStorage.setItem('measurementHistory', JSON.stringify(updatedHistory));
    }
  };

  const calculateDaysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <div>
      <h1 id="Historyh2">Measurement History</h1>
      <ul>
        {history.map((entry, index) => (
          <div key={index}>
            {index > 0 && (
              <h2>
                {calculateDaysBetween(history[index - 1].date, entry.date)} days since last measurement
              </h2>
            )}
            <li id='history'>
              <span className="date">{entry.date}</span> Weight: {entry.measurements.weight}kg, Fat Mass: {entry.measurements.fat}%, Muscle Mass: {entry.measurements.muscle}%, Water: {entry.measurements.water}%
            </li>
          </div>
        ))}
      </ul>

      <button id='back' onClick={onBack}>Back</button>
      {history.length > 0 && (
        <button id='clear' onClick={handleClearHistory}>Clear Last Entry</button>
      )}
    </div>
  );
};

export default HistoryPage;
