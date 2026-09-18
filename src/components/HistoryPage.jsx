import { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { useLanguage } from '../LanguageContext';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const HistoryPage = ({ onBack }) => {
  const { t } = useLanguage();
  const [history, setHistory] = useState([]);
  const bottomRef = useRef(null);

  HistoryPage.propTypes= { onBack: PropTypes.func.isRequired}

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem('measurementHistory')) || [];
    setHistory(savedHistory);
  }, []);

  // Jump straight to the most recent (bottom) entry once the list is rendered.
  useEffect(() => {
    if (history.length > 0 && bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, [history]);

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


<<<<<<< HEAD
  const handleSendEmail = async () => {
    // Format the history data (no "days between" lines).
    const emailBody = history
      .map(entry =>
        `Date: ${entry.date}\nWeight: ${entry.measurements.weight}kg\nFat Mass: ${entry.measurements.fat}%\nMuscle Mass: ${entry.measurements.muscle}%\nWater: ${entry.measurements.water}%`
      )
      .join('\n\n');

    // Preferred: native share sheet. Works reliably inside Android/WebView apps
    // and lets the user pick Gmail or any email/messaging app.
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Measurement History', text: emailBody });
        return;
      } catch (err) {
        if (err && err.name === 'AbortError') return; // user cancelled the share sheet
        // otherwise fall through to the mailto fallback
      }
    }

    // Fallback for browsers/devices without the share sheet.
    const email = prompt('Enter your email:');
=======
  const handleSendEmail = () => {
    const email = prompt(t('enterEmail'));
>>>>>>> c16c561 (Add English/Greek language switcher across all pages)
    if (!email) return;
    const mailtoLink = `mailto:${email}?subject=Measurement History&body=${encodeURIComponent(emailBody)}`;
    window.location.href = mailtoLink;
  };


        // Prepare data for the graph
      const chartData = {
  labels: history.map((entry) => entry.date), // Labels based on the dates
  datasets: [
    {
      label: t('chartWeight'),
      data: history.map((entry) => entry.measurements.weight),
      borderColor: 'rgb(25, 54, 216)',
      backgroundColor: 'rgba(75, 192, 192, 0.2)',
      fill: false,
    },
    {
      label: t('chartFat'),
      data: history.map((entry) => entry.measurements.fat),
      borderColor: 'rgb(228, 160, 15)',
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      fill: false,
    },
    {
      label: t('chartMuscle'),
      data: history.map((entry) => entry.measurements.muscle),
      borderColor: 'rgb(235, 90, 54)',
      backgroundColor: 'rgba(54, 162, 235, 0.2)',
      fill: false,
    },
    {
      label: t('chartWater'),
      data: history.map((entry) => entry.measurements.water),
      borderColor: 'rgb(102, 250, 255)',
      backgroundColor: 'rgba(153, 102, 255, 0.2)',
      fill: false,
    }
  ]
};


  return (
    <div>
      <h1 id="Historyh2">{t('measurementHistory')}</h1>
   {/* Render Chart.js Line Chart */}
   {history.length > 0 && ( <div> <Line data={chartData} options={{ responsive: true }} /> </div> )}
      <ul id="historyul"> {history.map((entry, index) => (
          <div key={index}> {index > 0 && (
              <h2> {t('daysBetween', { value: calculateDaysBetween(history[index - 1].date, entry.date) })} </h2> )}
            <li id='history'>
              <span className="date">{entry.date}</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; {t('labelWeight')} {entry.measurements.weight}kg &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{t('labelFat')} {entry.measurements.fat}% <br />
              &nbsp;&nbsp;&nbsp;&nbsp; {t('labelMuscle')} {entry.measurements.muscle}% ({calculateMuscleKg(entry.measurements.weight, entry.measurements.muscle)} kg)&nbsp;&nbsp;&nbsp;&nbsp; {t('labelWater')} {entry.measurements.water}%
            </li>
          </div>
        ))}
      </ul>
      <div ref={bottomRef} />

      <button id='back' onClick={onBack}>{t('back')}</button>
      
      {history.length > 0 && ( <button id='clear' onClick={handleClearHistory}>{t('clearLastEntry')}</button> )}
      {history.length > 0 &&(<button id='email' onClick={handleSendEmail}>{t('emailHistory')}</button>)}
    </div>
  );
};

export default HistoryPage;
