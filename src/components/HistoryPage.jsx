import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const HistoryPage = ({ onBack }) => {
  const [history, setHistory] = useState([]);

  HistoryPage.propTypes= { onBack: PropTypes.func.isRequired}

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

  const calculateMuscleKg = (weight, musclePercentage) => {
  if (!weight || !musclePercentage) return null;
  return ((musclePercentage / 100) * weight).toFixed(2); // keep 2 decimals
};


  const handleSendEmail = () => {
    const email = prompt('Enter your email:');
    if (!email) return;

    // Format the history data
    const emailBody = history
      .map(entry => 
        `Date: ${entry.date}\nWeight: ${entry.measurements.weight}kg\nFat Mass: ${entry.measurements.fat}%\nMuscle Mass: ${entry.measurements.muscle}%\nWater: ${entry.measurements.water}%\n\n`
      )
      .join('');

    // Open email client with pre-filled email
    const mailtoLink = `mailto:${email}?subject=Measurement History&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };


        // Prepare data for the graph
      const chartData = {
  labels: history.map((entry) => entry.date), // Labels based on the dates
  datasets: [
    {
      label: 'Weight (kg)',
      data: history.map((entry) => entry.measurements.weight),
      borderColor: 'rgb(25, 54, 216)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
    },
    {
      label: 'Fat Mass (%)',
      data: history.map((entry) => entry.measurements.fat),
      borderColor: 'rgb(228, 160, 15)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
    },
    {
      label: 'Muscle Mass (%)',
      data: history.map((entry) => entry.measurements.muscle),
      borderColor: 'rgb(235, 90, 54)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
    },
    {
      label: 'Water (%)',
      data: history.map((entry) => entry.measurements.water),
      borderColor: 'rgb(102, 250, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: false,
    }
  ]
};


  return (
    <div>
      <h1 id="Historyh2">Measurement History</h1>
   {/* Render Chart.js Line Chart */}
   {history.length > 0 && ( <div> <Line data={chartData} options={{ responsive: true }} /> </div> )}
      <ul id="historyul"> {history.map((entry, index) => (
          <div key={index}> {index > 0 && (
              <h2> {calculateDaysBetween(history[index - 1].date, entry.date)} days between last measurement </h2> )}
            <li id='history'>
              <span className="date">{entry.date}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Weight: {entry.measurements.weight}kg &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Fat Mass: {entry.measurements.fat}% <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Muscle Mass: {entry.measurements.muscle}% ({calculateMuscleKg(entry.measurements.weight, entry.measurements.muscle)} kg)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; Water: {entry.measurements.water}%
            </li>
          </div>
        ))}
      </ul>

      <button id='back' onClick={onBack}>Back</button>
      
      {history.length > 0 && ( <button id='clear' onClick={handleClearHistory}>Clear Last Entry</button> )}
      {history.length > 0 &&(<button id='email' onClick={handleSendEmail}>Email History</button>)}
    </div>
  );
};

export default HistoryPage;
