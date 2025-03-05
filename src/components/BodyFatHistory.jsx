import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const BodyFatHistory = ({ onBack }) => {
  const [history, setHistory] = useState([]);

  BodyFatHistory.propTypes= { onBack: PropTypes.func.isRequired}

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('bodyFatHistory')) || [];
    setHistory(savedHistory);
  }, []);

  const handleClearHistory = () => {
    if (history.length > 0) {
      const updatedHistory = history.slice(0, -1);
      setHistory(updatedHistory);
      localStorage.setItem('bodyFatHistory', JSON.stringify(updatedHistory));
    }
  };

  const calculateDaysBetween = (date1, date2) => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2 - d1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

 // Prepare data for the graph
 const chartData = {
    labels: history.map((entry) => entry.timestamp), // Labels based on the dates
    datasets: [
     
      {
        label: 'Fat Mass (%)',
        data: history.map((entry) => entry.bodyFat),
        borderColor: 'rgb(228, 160, 15)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    
    ]
  };
  
  return (
    <div>
      <h1 id="Historyh2">Fat Measurement History</h1>
   {history.length > 0 && ( <div> <div> <Line data={chartData} options={{ responsive: true }} /> </div></div> )}
      <ul id="historyul"> {history.map((entry, index) => (
          <div key={index}> {index > 0 && (
              <h2> {calculateDaysBetween(history[index - 1].timestamp, entry.timestamp)} days between last measurement </h2> )}
              <li id="caliperli"> <span className="date">{entry.timestamp}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>{entry.bodyFat}% Body Fat</span></li>
          </div>
        ))}
      </ul>

      <button id='back' onClick={onBack}>Back</button>
      {history.length > 0 && ( <button id='clear' onClick={handleClearHistory}>Clear Last Entry</button> )}
    </div>
  );
};

export default BodyFatHistory;
