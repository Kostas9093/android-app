import { useState } from 'react';
import './App.css';
import MeasurementForm from './components/MeasurementForm';
import HistoryPage from './components/HistoryPage';
import WelcomePage from './components/WelcomePage';

function App() {
  const [isWelcome, setIsWelcome] = useState(true);   // Step 1: Welcome Page
  const [showHistory, setShowHistory] = useState(false); // Step 3: Show History
  const [showResults, setShowResults] = useState(false); // Track if we are showing results instead of form

  // Function to handle navigation between welcome, history, and main form
  const handleWelcomeStart = () => {
    setIsWelcome(false);
  };

  const handleShowHistory = () => {
    setShowHistory(true);
  };

  const handleBackToMain = () => {
    setShowResults(false);  //  Hide results
    setShowHistory(false);   // Hide history
    setIsWelcome(true);     // Show welcome page
  };

  return (
    <div className="App">
      {isWelcome ? (
        <WelcomePage onStart={handleWelcomeStart} />  // Step 1: Showing welcome page first
      ) : showHistory ? (
        <HistoryPage onBack={handleBackToMain} />    // Step 3: Showing history
      ) : (
        <>
          <h1>Weight Progress Tracker</h1>
          <MeasurementForm 
            onShowHistory={handleShowHistory} 
            onBackToMain={handleBackToMain}
            showResults={showResults}         // Pass showResults state to MeasurementForm
            setShowResults={setShowResults}   // Allow MeasurementForm to control result visibility
          />
         
        </>
      )}
    </div>
  );
}

export default App;
