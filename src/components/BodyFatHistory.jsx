import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '../LanguageContext';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const BodyFatHistory = ({ onBack }) => {
  const { t } = useLanguage();
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

  const handleSendEmail = () => {
    const email = prompt(t('enterEmail'));
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
    labels: history.map((entry) => entry.timestamp), // Labels based on the dates
    datasets: [
     
      {
        label: t('chartFat'),
        data: history.map((entry) => entry.bodyFat),
        borderColor: 'rgb(228, 160, 15)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
      },
    
    ]
  };
  
  return (
    <div>
      <h1 id="Historyh2">{t('fatMeasurementHistory')}</h1>
   {history.length > 0 && ( <div> <div> <Line data={chartData} options={{ responsive: true }} /> </div></div> )}
      <ul id="historyul"> {history.map((entry, index) => (
          <div key={index}> {index > 0 && (
              <h2> {t('daysBetween', { value: calculateDaysBetween(history[index - 1].timestamp, entry.timestamp) })} </h2> )}
              <li id="caliperli"> <span className="date">{entry.timestamp}&nbsp;&nbsp;&nbsp;&nbsp;</span>
              <span>{t('bodyFatEntry', { value: entry.bodyFat })}</span></li>
          </div>
        ))}
      </ul>

      <button id='back' onClick={onBack}>{t('back')}</button>
      {history.length > 0 && ( <button id='clear' onClick={handleClearHistory}>{t('clearLastEntry')}</button> )}
      {history.length > 0 &&(<button id='email' onClick={handleSendEmail}>{t('emailHistory')}</button>)}
    </div>
  );
};

export default BodyFatHistory;
