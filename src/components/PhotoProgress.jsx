import { useState, useEffect } from "react";
import PropTypes from 'prop-types';

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);


PhotoProgress.propTypes = {onBack: PropTypes.func.isRequired};

  // Load stored photos on mount
  useEffect(() => {const storedPhotos = JSON.parse(localStorage.getItem("progressPhotos")) || [];setPhotos(storedPhotos); }, []);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newPhoto = {url: reader.result, date: new Date().getTime() }; // Store timestamp instead of formatted date 
        const updatedPhotos = [...photos, newPhoto];
        setPhotos(updatedPhotos);
        localStorage.setItem("progressPhotos", JSON.stringify(updatedPhotos)); // Save in localStorage
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
      &nbsp;&nbsp;&nbsp;&nbsp;<input type="file" accept="image/*" onChange={handleFileChange} id="chooseFile" />  {/* Upload Photo */} 
      
      {/* Photo History */}
      <div>{photos.map((photo, index) => {let daysBetween = null;

          // Calculate days difference if it's not the first photo
          if (index > 0) {
            const prevPhotoDate = new Date(photos[index - 0].date); // the index was 1 and i replaced it with 0 and works if not put it back to one
            const currentPhotoDate = new Date(photo.date);
            const diffTime = Math.abs(currentPhotoDate - prevPhotoDate);
            daysBetween = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }

          return (
            <div key={index} className="relative">
              <img src={photo.url} alt="Progress" className="photosize" />
              <p className="Photodates">{new Date(photo.date).toLocaleDateString()}</p>
              {daysBetween !== null && (
                <p className="PhotoDiff">⏳ {daysBetween} days since last photo</p>
              )}
            </div>
          );
        })}
      </div>
      <button onClick={onBack} id="backPhoto">Back</button>
      {photos.length > 0 && (<button onClick={handleClearHistory} className="ClearPhoto">Clear Last Entry</button> )}
    
    </div>
  );
};

export default PhotoProgress;
