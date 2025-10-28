import { useState, useEffect } from "react";
import PropTypes from "prop-types";

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);

  // Load stored photos on mount (safe parse)
  useEffect(() => {
    const raw = localStorage.getItem("progressPhotos");
    if (!raw) {
      setPhotos([]);
      return;
    }
    try {
      const storedPhotos = JSON.parse(raw) || [];
      // ensure storedPhotos is an array of objects
      if (!Array.isArray(storedPhotos)) throw new Error("progressPhotos is not an array");
      setPhotos(storedPhotos);
    } catch (err) {
      console.error("Failed to parse progressPhotos from localStorage:", err);
      // clear corrupted data so it doesn't crash next time
      localStorage.removeItem("progressPhotos");
      setPhotos([]);
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

      // Reset the input after read completes
      try {
        event.target.value = "";
      } catch (err) {
        console.warn("Unable to reset file input value:", err);
      }
    };

    // start reading
    try {
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("FileReader failed:", err);
    }
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

  // Create a safe list to render: filter out anything that lacks a usable url or date
  const safePhotos = Array.isArray(photos)
    ? photos.filter((p) => p && typeof p.url === "string" && p.url.length > 0 && (p.date || p.date === 0))
    : [];

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
        {safePhotos.map((photo, index) => {
          let daysBetween = null;

          try {
            if (index > 0) {
              const prev = new Date(safePhotos[index - 1].date);
              const curr = new Date(photo.date);

              if (isFinite(prev.getTime()) && isFinite(curr.getTime())) {
                const prevDateOnly = new Date(prev.getFullYear(), prev.getMonth(), prev.getDate());
                const currDateOnly = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());
                const diffTime = currDateOnly - prevDateOnly;
                daysBetween = Math.round(diffTime / (1000 * 60 * 60 * 24));
              } else {
                // invalid dates — don't crash, just leave daysBetween null
                daysBetween = null;
              }
            }
          } catch (err) {
            console.error("Error calculating daysBetween for photo index", index, err);
            daysBetween = null;
          }

          return (
            <div key={photo.date || index} className="relative">
              {/* protect image load with alt text and width/height (helps avoid layout shift) */}
              <img src={photo.url} alt={`Progress ${index + 1}`} className="photosize" />
              <p className="Photodates">
                {isFinite(new Date(photo.date).getTime()) ? new Date(photo.date).toLocaleDateString() : "Unknown Date"}
              </p>
              {daysBetween !== null && (
                <p className="PhotoDiff">⏳ {daysBetween} {daysBetween === 1 ? "day" : "days"} since last photo</p>
              )}
            </div>
          );
        })}
      </div>

      <button onClick={onBack} id="backPhoto">Back</button>
      {safePhotos.length > 0 && (
        <button onClick={handleClearHistory} className="ClearPhoto">Clear Last Entry</button>
      )}
    </div>
  );
};

PhotoProgress.propTypes = {
  onBack: PropTypes.func.isRequired,
};

export default PhotoProgress;
