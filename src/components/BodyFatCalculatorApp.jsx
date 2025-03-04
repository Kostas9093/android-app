import { useState } from 'react';
import PropTypes from 'prop-types';

const BodyFatCalculatorApp = ({ onBack }) => {
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [measurements, setMeasurements] = useState({ chest: '', abdomen: '', thigh: '' });
    const [bodyFat, setBodyFat] = useState(null);
    const [history, setHistory] = useState([]);

    BodyFatCalculatorApp.propTypes = {
        onBack: PropTypes.func.isRequired,
    };

    const handleMeasurementChange = (e) => {
        setMeasurements({
            ...measurements,
            [e.target.name]: e.target.value
        });
    };
    const handleExit = () => {
        if (window.confirm("Are you sure you want to exit?")) {
          window.close(); // This will attempt to close the browser tab
        }
      };
    const calculateBodyFat = () => {
        const sum = parseFloat(measurements.chest) + parseFloat(measurements.abdomen) + parseFloat(measurements.thigh);

        let bodyFatPercentage;
        if (gender === 'male') {
            bodyFatPercentage = 0.39287 * sum - 0.00105 * Math.pow(sum, 2) + 0.15772 * age - 5.18845;
        } else if (gender === 'female') {
            bodyFatPercentage = 0.29669 * sum - 0.00043 * Math.pow(sum, 2) + 0.02963 * age + 1.4072;
        } else {
            bodyFatPercentage = 'Please select a gender';
        }

        if (bodyFatPercentage && bodyFatPercentage !== 'Please select a gender') {
            const roundedBodyFat = bodyFatPercentage.toFixed(2);
            setBodyFat(roundedBodyFat);
            saveToLocalStorage(roundedBodyFat);
        } else {
            setBodyFat(null);
        }
    };

    const saveToLocalStorage = (result) => {
        const timestamp = new Date().toISOString().split('T')[0];
        const newEntry = { bodyFat: result, timestamp };

        // Retrieve existing history or initialize an empty array
        const existingHistory = JSON.parse(localStorage.getItem('bodyFatHistory')) || [];
        const updatedHistory = [...existingHistory, newEntry];

        // Save updated history to local storage
        localStorage.setItem('bodyFatHistory', JSON.stringify(updatedHistory));
    };

    const showHistory = () => {
        // Retrieve history from local storage
        const savedHistory = JSON.parse(localStorage.getItem('bodyFatHistory')) || [];
        setHistory(savedHistory);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateBodyFat();
    };
    const handleClearHistory = () => {
        if (history.length > 0) {
          const updatedHistory = history.slice(0, -1);
          setHistory(updatedHistory);
          localStorage.setItem('bodyFatHistory', JSON.stringify(updatedHistory));
        }
      };

    return (
        <div className="body-fat-calculator">
            <h1>Body Fat Calliper Calculator</h1>
        <br></br>
            <form onSubmit={handleSubmit}>
                
                    <label>Gender:</label>
                    <select className="field" value={gender} onChange={(e) => setGender(e.target.value)} required>
                        <option value="">Select</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                
                <label>Age: </label>
                <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    required 
                />
                <br />
                
                <label>Chest Skinfold (mm): </label>
                <input 
                    type="number" 
                    name="chest" 
                    value={measurements.chest} 
                    onChange={handleMeasurementChange} 
                    required 
                />
                <br />
                
                <label>Abdomen Skinfold (mm): </label>
                <input 
                    type="number" 
                    name="abdomen" 
                    value={measurements.abdomen} 
                    onChange={handleMeasurementChange} 
                    required 
                />
                <br />
                
                <label>Thigh Skinfold (mm): </label>
                <input 
                    type="number" 
                    name="thigh" 
                    value={measurements.thigh} 
                    onChange={handleMeasurementChange} 
                    required 
                />

                <br />

                <button id="backCaliper" onClick={onBack}>Back</button>
                <button id="caliper" type="submit">Calculate</button>
            </form>

            <br />
            {bodyFat && ( <div> <h2 id="resulth" >Your Body Fat Percentage:</h2> <p id="resultp">{bodyFat}%&nbsp;&nbsp; Body Fat</p> </div> )}

            <button id="exitCaliper" onClick={handleExit}>Exit</button> <button id="CaliperHistoryB" onClick={showHistory}>Show History</button>
            <br></br>
            {history.length > 0 && ( 
                <div id="caliperhistory">{history.map((entry, index) => (
            
            <div key={index} className="history-entry">
                <p className="history-date">{entry.timestamp}&nbsp;&nbsp;&nbsp;&nbsp;</p>
                <p className="history-bodyfat">{entry.bodyFat}% Body Fat</p>
            </div>
        ))}
    </div>
)}

{history.length > 0 && ( <button id='clearh' onClick={handleClearHistory} >Clear Last Entry</button> )}
        
     </div>
    );
};

export default BodyFatCalculatorApp;
