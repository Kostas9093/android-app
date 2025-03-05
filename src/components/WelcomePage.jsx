import PropTypes from 'prop-types';

const WelcomePage = ({ onStart, onOpenCalculator }) => {

 WelcomePage.propTypes = {
        onStart: PropTypes.func.isRequired, onOpenCalculator: PropTypes.func.isRequierd
    };

  return (
    <div className="welcome">
      <h1>Weight Progress Tracker</h1>
      <div className="start-box" onClick={onStart}>  {/* Step 1: Redirect to main app */}
        <h2>Register your weight & follow your progress</h2>
      </div>
      <div className="calculator-box" onClick={onOpenCalculator}>
        <h2>Calculate your body fat percentage with fat calliper</h2>
      </div>
    </div>
  );
};

export default WelcomePage;
