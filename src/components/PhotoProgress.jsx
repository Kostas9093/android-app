import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);

  PhotoProgress.propTypes = {
    onBack: PropTypes.func.isRequired,
  };

  // ✅ Safe load
  useEffect(() => {
    try {
      const raw = localStorage.getItem("progressPhotos");
      if (!raw) return;
      const storedPhotos = JSON.parse(raw);
      if (Array.isArray(storedPhotos)) {
        setPhotos(storedPhotos);
      } else {
        console.warn("progressPhotos not an array, clearing...");
        localStorage.removeItem("progressPhotos");
      }
    } catch (err) {
      console.error("Invalid JSON in progressPhotos, clearing storage:", err);
      localStorage.removeItem("progressPhotos");
    }
  }, []);

  // ✅ Sync state to localStorage safely
  useEffect(() => {
    try {
      localStorage.setItem("progressPhotos", JSON.stringify(photos));
    } catch (err) {
      console.error("Failed to save photos:", err);
    }
  }, [photos]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const newPhoto = {
        url: reader.result,
        date: Date.now(),
      };
      setPhotos((prev) => [...prev, newPhoto]);
      event.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handleClearHistory = () => {
    if (photos.length > 0) {
      setPhotos(photos.slice(0, -1));
    }
  };

  return (
    <div>
      <h1 className="Photoh1">Photo Progress</h1>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        id="chooseFile"
      />

      <div>
        {photos.map((photo, index) => {
          let daysBetween = null;
          if (index > 0) {
            const prev = new Date(photos[index - 1].date);
            const curr = new Date(photo.date);
            if (!isNaN(prev) && !isNaN(curr)) {
              const diff =
                new Date(curr.getFullYear(), curr.getMonth(), curr.getDate()) -
                new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
              daysBetween = Math.round(diff / (1000 * 60 * 60 * 24));
            }
          }

          return (
            <div key={index} className="relative">
              <img src={photo.url} alt="Progress" className="photosize" />
              <p className="Photodates">
                {new Date(photo.date).toLocaleDateString()}
              </p>
              {daysBetween !== null && (
                <p className="PhotoDiff">
                  ⏳ {daysBetween}{" "}
                  {daysBetween === 1 ? "day" : "days"} since last photo
                </p>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={onBack} id="backPhoto">Back</button>
      {photos.length > 0 && (
        <button onClick={handleClearHistory} className="ClearPhoto">
          Clear Last Entry
        </button>
      )}
    </div>
  );
};

export default PhotoProgress;
