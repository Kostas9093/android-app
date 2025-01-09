// src/components/BodyFatCalculatorApp.js
import  { useState } from 'react';
import PropTypes from 'prop-types';





const BodyFatCalculatorApp = ({ onBack }) => {
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [weight, setWeight] = useState('');
    const [measurements, setMeasurements] = useState({ chest: '', abdomen: '', thigh: '' });
    const [bodyFat, setBodyFat] = useState(null);

    // Add prop-types validation
    BodyFatCalculatorApp.propTypes = {
     onBack: PropTypes.func.isRequired,
     };

    const handleMeasurementChange = (e) => {
        setMeasurements({
            ...measurements,
            [e.target.name]: e.target.value
        });
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

        setBodyFat(bodyFatPercentage ? bodyFatPercentage.toFixed(2) : null);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        calculateBodyFat();
    };

    return (
        <div className="body-fat-calculator">
            <h2>Body Fat Calculator</h2>

            <form onSubmit={handleSubmit}>

         <div className="field">

        <label id="Gen">Gender:</label>
         <select value={gender} onChange={(e) => setGender(e.target.value)} required>
         <option value="">Select</option>
         <option value="male">Male</option>
         <option value="female">Female</option>
    </select>
        </div>
        
<div className="field"></div>
                
                
                <label>Age: </label>
                <input 
                    type="number" 
                    value={age} 
                    onChange={(e) => setAge(e.target.value)} 
                    required 
                />
                <br />
                
                <label>Weight (kg): </label>
                <input 
                    type="number" 
                    value={weight} 
                    onChange={(e) => setWeight(e.target.value)} 
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
                
                <button id="caliper" type="submit">Calculate Body Fat Percentage</button>
            </form>
            
            {bodyFat && (
                <div>
                    <h2>Your Body Fat Percentage:</h2>
                    <p>{bodyFat}%</p>
                </div>
            )}
            <button onClick={onBack}>Back to Welcome</button>
        </div>
    );
};

export default BodyFatCalculatorApp;
