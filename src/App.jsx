import { useState } from 'react';
import './App.css';
import MeasurementForm from './components/MeasurementForm';
import HistoryPage from './components/HistoryPage';
import WelcomePage from './components/WelcomePage';
import BodyFatCalculatorApp from './components/BodyFatCalculatorApp'; // Import the new calculator component
import BodyFatHistory from './components/BodyFatHistory'; // Controls Body Fat History visibility

function App() {
  const [isWelcome, setIsWelcome] = useState(true);   // Controls Welcome Page visibility
  const [showHistory, setShowHistory] = useState(false); // Controls History Page visibility
  const [showResults, setShowResults] = useState(false); // Controls Results visibility in MeasurementForm
  const [showCalculator, setShowCalculator] = useState(false); // Controls Body Fat Calculator visibility
  const [showFatHistory, setShowFatHistory] = useState(false); 

  // Function to handle navigation from Welcome Page to Main Form
  const handleWelcomeStart = () => {
    setIsWelcome(false);
  };

  // Function to show the History Page
  const handleShowHistory = () => {
    setShowHistory(true);
  };
  
  // Function to show the Body Fat History Page
  const handleFatHistory =() =>{
    setShowFatHistory(true);
  }
  // Function to show the Body Fat Calculator
  const handleOpenCalculator = () => {
    setShowCalculator(true);
    setIsWelcome(false); // Hide the Welcome Page when entering the calculator
  };

  // Function to navigate back to the Main form
  const handleBackToMain = () => {
    setShowResults(false);  // Hide results
    setShowHistory(false);   // Hide history
    setShowCalculator(false); // Hide calculator
    setIsWelcome(true);     // Show welcome page
    setShowFatHistory(false); // Hide Body Fat History
  };

  return (
    <div className="App">
      {isWelcome ? (
        <WelcomePage onStart={handleWelcomeStart}  onOpenCalculator={handleOpenCalculator} // Pass handler to open the calculator
        />
      ) : showHistory ? (
        <HistoryPage onBack={handleBackToMain} /> ) : showFatHistory ? (
        <BodyFatHistory onBack={handleBackToMain} /> ) : showCalculator ? (
        <BodyFatCalculatorApp onBack={handleBackToMain}  showFatHistory={handleFatHistory}/> // Render the calculator with a back button
      ) : (
        <>
          <MeasurementForm 
            onShowHistory={handleShowHistory} 
            onBackToMain={handleBackToMain}
            showResults={showResults}         
            setShowResults={setShowResults}  />
        </>
      )}
    </div>
  );
}

export default App;
