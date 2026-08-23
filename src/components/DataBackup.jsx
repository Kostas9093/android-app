import { useState } from "react";
import localforage from "localforage";

// Keys we know the app uses in localStorage. We also sweep every other
// localStorage key just in case, so nothing gets left behind.
const PHOTO_KEY = "progressPhotos";

const collectLocalStorage = () => {
  const data = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    data[key] = localStorage.getItem(key);
  }
  return data;
};

const DataBackup = () => {
  const [open, setOpen] = useState(false);
  const [backupText, setBackupText] = useState(""); // numeric history (small, copy/paste friendly)
  const [restoreText, setRestoreText] = useState("");
  const [status, setStatus] = useState("");

  // Build the small, copy/paste friendly backup (localStorage only = your numbers).
  const buildHistoryText = () => {
    const payload = {
      app: "body-tracker-backup",
      version: 1,
      exportedAt: new Date().toISOString(),
      localStorage: collectLocalStorage(),
    };
    const text = JSON.stringify(payload);
    setBackupText(text);
    setStatus("History loaded below. Select all and copy, or use the Copy button.");
    return text;
  };

  const copyHistory = async () => {
    const text = backupText || buildHistoryText();
    try {
      await navigator.clipboard.writeText(text);
      setStatus("Copied to clipboard. Paste it somewhere safe (email/notes).");
    } catch {
      // Fallback for older WebViews without the async clipboard API.
      const ta = document.getElementById("backupTextArea");
      if (ta) {
        ta.focus();
        ta.select();
        try {
          document.execCommand("copy");
          setStatus("Copied to clipboard. Paste it somewhere safe (email/notes).");
        } catch {
          setStatus("Could not auto-copy. Long-press the text, Select all, then Copy.");
        }
      }
    }
  };

  // Full backup including photos (large) -> downloaded as a file.
  const downloadFullBackup = async () => {
    try {
      let photos = null;
      try {
        photos = await localforage.getItem(PHOTO_KEY);
      } catch {
        photos = null;
      }
      const payload = {
        app: "body-tracker-backup",
        version: 1,
        exportedAt: new Date().toISOString(),
        localStorage: collectLocalStorage(),
        photos: photos || null,
      };
      const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `body-tracker-backup-${new Date()
        .toISOString()
        .slice(0, 10)}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setStatus("Full backup file created (includes photos).");
    } catch (err) {
      setStatus("Download failed on this device. Use Copy History instead. " + err);
    }
  };

  const handleFile = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setRestoreText(String(reader.result || ""));
    reader.readAsText(file);
  };

  const restore = async () => {
    if (!restoreText.trim()) {
      setStatus("Paste your backup text (or choose a backup file) first.");
      return;
    }
    let parsed;
    try {
      parsed = JSON.parse(restoreText);
    } catch {
      setStatus("That doesn't look like valid backup data. Check you copied all of it.");
      return;
    }
    if (!parsed || typeof parsed !== "object" || !parsed.localStorage) {
      setStatus("Backup data is missing the history section.");
      return;
    }
    if (
      !window.confirm(
        "Restore this backup? It will overwrite the history currently on this device."
      )
    ) {
      return;
    }
    try {
      Object.entries(parsed.localStorage).forEach(([key, value]) => {
        if (typeof value === "string") localStorage.setItem(key, value);
      });
      if (parsed.photos) {
        await localforage.setItem(PHOTO_KEY, parsed.photos);
      }
      setStatus("Restore complete. Reloading...");
      setTimeout(() => window.location.reload(), 800);
    } catch (err) {
      setStatus("Restore failed: " + err);
    }
  };

  if (!open) {
    return (
      <div style={{ marginTop: 16 }}>
        <button id="backupToggle" onClick={() => setOpen(true)}>
          Backup / Restore Data
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        marginTop: 16,
        padding: 12,
        border: "1px solid #888",
        borderRadius: 8,
        textAlign: "left",
      }}
    >
      <h2>Backup / Restore</h2>

      <h3>1. Back up (save your history)</h3>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button onClick={buildHistoryText}>Show History</button>
        <button onClick={copyHistory}>Copy History</button>
        <button onClick={downloadFullBackup}>Download Full Backup (with photos)</button>
      </div>
      <textarea
        id="backupTextArea"
        readOnly
        value={backupText}
        placeholder="Tap 'Show History', then long-press here, Select all and Copy."
        rows={6}
        style={{ width: "100%", marginTop: 8 }}
      />

      <h3>2. Restore (load into a new app)</h3>
      <input type="file" accept="application/json,.json" onChange={handleFile} />
      <textarea
        value={restoreText}
        onChange={(e) => setRestoreText(e.target.value)}
        placeholder="Paste your backup text here, or choose a backup file above."
        rows={6}
        style={{ width: "100%", marginTop: 8 }}
      />
      <div style={{ marginTop: 8 }}>
        <button onClick={restore}>Restore Now</button>
      </div>

      {status && (
        <p style={{ marginTop: 10, color: "#2a6" }}>
          {status}
        </p>
      )}

      <div style={{ marginTop: 10 }}>
        <button onClick={() => setOpen(false)}>Close</button>
      </div>
    </div>
  );
};

export default DataBackup;
