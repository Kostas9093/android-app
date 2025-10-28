                                          import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);

  // Load stored photos on mount (safe parse)
  useEffect(() => {
    const raw = localStorage.getItem("progressPhotos");
    if (raw) {
      try {
        const storedPhotos = JSON.parse(raw) || [];
        setPhotos(storedPhotos);
      } catch (err) {
        console.error("Failed to parse progressPhotos from localStorage:", err);
        // If data is corrupted, remove it so it doesn't crash later
        localStorage.removeItem("progressPhotos");
        setPhotos([]);
      }
    }
  }, []);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        url: reader.result,
        date: new Date().getTime(),
      };

      setPhotos((prevPhotos) => {
        const updatedPhotos = [...prevPhotos, newPhoto];
        try {
          localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos));
        } catch (err) {
          console.error("Failed to write progressPhotos to localStorage:", err);
        }
        return updatedPhotos;
      });

      // Reset file input after read completes so the same file can be reselected later
      try {
        event.target.value = "";
      } catch (err) {
        // ignore - some environments may not allow resetting; logging for debugging
        console.warn("Unable to reset file input value:", err);
      }
    };

    reader.readAsDataURL(file);
  };

  const handleClearHistory = () => {
    if (photos.length > 0) {
      const updatedPhotos = photos.slice(0, -1);
      try {
        localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos));
      } catch (err) {
        console.error("Failed to write progressPhotos to localStorage:", err);
      }
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

          if (index > 0) {
            const prev = new Date(photos[index - 1].date);
            const curr = new Date(photo.date);

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

PhotoProgress.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default PhotoProgress;
                                    
