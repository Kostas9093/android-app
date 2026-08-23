import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import localforage from "localforage";

const PhotoProgress = ({ onBack }) => {
  const [photos, setPhotos] = useState([]);

  PhotoProgress.propTypes = {
    onBack: PropTypes.func.isRequired,
  };

  // ✅ Load photos with migration from localStorage → IndexedDB (localforage)
  useEffect(() => {
    const migrateAndLoad = async () => {
      try {
        // 1️⃣ Try to load from IndexedDB first
        const stored = await localforage.getItem("progressPhotos");
        if (stored && Array.isArray(stored)) {
          setPhotos(stored);
          return;
        }

        // 2️⃣ If not found, migrate from old localStorage
        const legacy = localStorage.getItem("progressPhotos");
        if (legacy) {
          const parsed = JSON.parse(legacy);
          if (Array.isArray(parsed)) {
            await localforage.setItem("progressPhotos", parsed);
            setPhotos(parsed);
            console.log("✅ Migrated photos from localStorage to IndexedDB");
            // Optionally remove old localStorage copy
            // localStorage.removeItem("progressPhotos");
          }
        }
      } catch (err) {
        console.error("⚠️ Failed to load or migrate photos:", err);
      }
    };

    migrateAndLoad();
  }, []);

  // ✅ Sync state to IndexedDB whenever photos change
  useEffect(() => {
    localforage.setItem("progressPhotos", photos).catch((err) => {
      console.error("⚠️ Failed to save photos:", err);
    });
  }, [photos]);

  // ✅ Handle new file uploads
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
      event.target.value = ""; // reset file input
    };
    reader.readAsDataURL(file);
  };

  // ✅ Clear last photo
  const handleClearHistory = () => {
    if (photos.length > 0) {
      setPhotos((prev) => prev.slice(0, -1));
    }
  };

  // Convert a stored data URL into a File object we can share.
  const dataUrlToFile = (dataUrl, filename) => {
    const [header, base64] = dataUrl.split(",");
    const mimeMatch = header.match(/data:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
    return new File([bytes], filename, { type: mime });
  };

  // Save / share the real image files via the native share sheet.
  // Use this in the OLD app to get photos out, then re-upload them in the new app.
  const handleSharePhotos = async () => {
    if (photos.length === 0) return;

    const ext = (mime) => (mime && mime.includes("png") ? "png" : "jpg");

    // Preferred: share all files at once.
    try {
      const files = photos.map((p, i) => {
        const dateStr = new Date(p.date).toISOString().slice(0, 10);
        const f = dataUrlToFile(p.url, `progress-${dateStr}-${i + 1}.jpg`);
        return new File([f], `progress-${dateStr}-${i + 1}.${ext(f.type)}`, { type: f.type });
      });

      if (navigator.canShare && navigator.canShare({ files })) {
        await navigator.share({ files, title: "Progress Photos" });
        return;
      }
    } catch (err) {
      if (err && err.name === "AbortError") return; // user cancelled
      // fall through to one-by-one
    }

    // Fallback: share one photo at a time (some devices only allow single files).
    try {
      for (let i = 0; i < photos.length; i++) {
        const p = photos[i];
        const dateStr = new Date(p.date).toISOString().slice(0, 10);
        const file = dataUrlToFile(p.url, `progress-${dateStr}-${i + 1}.jpg`);
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
          // eslint-disable-next-line no-await-in-loop
          await navigator.share({ files: [file], title: `Progress photo ${i + 1}` });
        } else {
          alert(
            "Your app can't share files directly. Easiest alternative: open each photo and take a screenshot, then re-upload it in the new app."
          );
          return;
        }
      }
    } catch (err) {
      if (err && err.name === "AbortError") return;
      alert(
        "Sharing was blocked. Alternative: take a screenshot of each photo and re-upload it in the new app."
      );
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
                new Date(
                  curr.getFullYear(),
                  curr.getMonth(),
                  curr.getDate()
                ) -
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

      <button onClick={onBack} id="backPhoto">
        Back
      </button>
      {photos.length > 0 && (
        <button onClick={handleClearHistory} className="ClearPhoto">
          Clear Last Entry
        </button>
      )}
      {photos.length > 0 && (
        <button onClick={handleSharePhotos} className="SharePhoto">
          Save / Share Photos
        </button>
      )}
    </div>
  );
};

export default PhotoProgress;
