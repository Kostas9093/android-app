import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);

  PhotoProgress.propTypes = {
    onBack: PropTypes.func.isRequired
  };

  // Load stored photos on mount
  useEffect(() => {
    const storedPhotos = JSON.parse(localStorage.getItem("progressPhotos")) || [];
    setPhotos(storedPhotos);
  }, []);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {
          url: reader.result,
          date: new Date().getTime() // Store timestamp
        };
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClearHistory = () => {
    if (photos.length > 0) {
      const updatedPhotos = photos.slice(0, -1);
      localStorage.setItem('progressPhotos', JSON.stringify(updatedPhotos));
      setPhotos(updatedPhotos);
    }
  };

  return (
    <div>
      <h1 className="Photoh1">Photo Progress</h1>
      &nbsp;&nbsp;&nbsp;&nbsp;
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="chooseFile"
      />

      {/* Photo History */}
      <div>
        {photos.map((photo, index) => {
          let daysBetween = null;

          // Calculate calendar day difference if not the first photo
          if (index > 0) {
            const prev = new Date(photos[index - 1].date);
            const curr = new Date(photo.date);

            // Strip time from both dates
            const prevDateOnly = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
            const currDateOnly = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());

            const diffTime = currDateOnly - prevDateOnly;
            daysBetween = Math.round(diffTime / (1000 * 60 * 60 * 24));
          }

          return (
            <div key={index} className="relative">
              <img src={photo.url} alt="Progress" className="photosize" />
              <p className="Photodates">{new Date(photo.date).toLocaleDateString()}</p>
              {daysBetween !== null && (
                <p className="PhotoDiff">⏳ {daysBetween} {daysBetween === 1 ? "day" : "days"} since last photo</p>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={onBack} id="backPhoto">Back</button>
      {photos.length > 0 && (
        <button onClick={handleClearHistory} className="ClearPhoto">Clear Last Entry</button>
      )}
    </div>
  );
};

export default PhotoProgress;
