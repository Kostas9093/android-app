const WelcomePage = ({ onStart }) => {
  return (
    <div className="welcome">
      <h1>Weight Progress Tracker</h1>
      <div className="start-box" onClick={onStart}>  {/* Step 1: Redirect to main app */}
        <h2>Register your weight & follow your progress</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
