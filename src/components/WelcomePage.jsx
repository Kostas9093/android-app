const WelcomePage = ({ onStart }) => {
  return (
    <div className="welcome">
      <h1>Welcome to Weight Tracker</h1>
      <div className="start-box" onClick={onStart}>  {/* Step 1: Redirect to main app */}
        <h2>Register your weight</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
