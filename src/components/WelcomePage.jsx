import PropTypes from 'prop-types';

const WelcomePage = ({ onStart, onOpenCalculator, onOpenPhoto }) => {

 WelcomePage.propTypes = {
        onStart: PropTypes.func.isRequired, onOpenCalculator: PropTypes.func.isRequired, onOpenPhoto: PropTypes.func.isRequired
    };

  return (
    <div className="welcome">
      <h1>Weight Progress Tracker</h1>
      <div className="start-box" onClick={onStart}>  {/* Step 1: Redirect to main app */}
        <h2>Register your weight & check your progress</h2>
      </div>
      <div className="calculator-box" onClick={onOpenCalculator}>
        <h2>Calculate your body fat percentage with a fat calliper</h2>
      </div>
      <div className="calculator-box" onClick={onOpenPhoto} >
        <h2>Add a picture of your progress</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
