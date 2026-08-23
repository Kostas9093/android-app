// One-time seed of the imported measurement history.
// Runs only on a fresh install (when there is no history yet), so it will not
// overwrite data you enter later.

const SEED_FLAG = "historySeededV1";

const seedMeasurementHistory = [
  { date: "2025-09-30", measurements: { weight: "87.4", fat: "25.3", muscle: "38.2", water: "55.8" } },
  { date: "2025-10-28", measurements: { weight: "89.7", fat: "26.4", muscle: "37.6", water: "54.9" } },
  { date: "2025-11-16", measurements: { weight: "90.5", fat: "26.9", muscle: "37.3", water: "54.5" } },
  { date: "2025-11-30", measurements: { weight: "91.1", fat: "27.2", muscle: "37.1", water: "54.3" } },
  { date: "2025-12-16", measurements: { weight: "90.7", fat: "27.3", muscle: "37.1", water: "54.3" } },
  { date: "2025-12-21", measurements: { weight: "90.7", fat: "27.1", muscle: "37.2", water: "54.4" } },
  { date: "2025-12-29", measurements: { weight: "91.7", fat: "27.5", muscle: "37", water: "54" } },
  { date: "2026-01-02", measurements: { weight: "92.2", fat: "27.8", muscle: "36.8", water: "53.8" } },
  { date: "2026-01-20", measurements: { weight: "91.4", fat: "27.4", muscle: "37.1", water: "54.1" } },
  { date: "2026-02-25", measurements: { weight: "92.3", fat: "27.8", muscle: "36.8", water: "53.8" } },
  { date: "2026-03-15", measurements: { weight: "92.7", fat: "28.1", muscle: "36.7", water: "53.6" } },
  { date: "2026-04-05", measurements: { weight: "94", fat: "28.7", muscle: "36.3", water: "53.1" } },
  { date: "2026-05-12", measurements: { weight: "94.5", fat: "29", muscle: "36.2", water: "52.9" } },
  { date: "2026-06-02", measurements: { weight: "91", fat: "27.6", muscle: "36.3", water: "54.3" } },
  { date: "2026-06-15", measurements: { weight: "90.8", fat: "27.4", muscle: "36.4", water: "54.4" } },
  { date: "2026-06-21", measurements: { weight: "90.9", fat: "27.5", muscle: "36.4", water: "54.4" } },
  { date: "2026-06-28", measurements: { weight: "90.7", fat: "27.3", muscle: "36.5", water: "54.5" } },
  { date: "2026-07-05", measurements: { weight: "91", fat: "27.5", muscle: "36.4", water: "54.4" } },
  { date: "2026-07-11", measurements: { weight: "89.3", fat: "26.8", muscle: "36.8", water: "54.9" } },
  { date: "2026-07-17", measurements: { weight: "89.8", fat: "26.9", muscle: "36.7", water: "54.8" } },
  { date: "2026-07-22", measurements: { weight: "89.7", fat: "26.8", muscle: "36.7", water: "54.9" } },
  { date: "2026-08-02", measurements: { weight: "87.3", fat: "25.6", muscle: "37.4", water: "55.8" } },
  { date: "2026-08-09", measurements: { weight: "86.6", fat: "25.3", muscle: "37.6", water: "56.1" } },
  { date: "2026-08-14", measurements: { weight: "86.1", fat: "25", muscle: "37.8", water: "56.3" } },
  { date: "2026-08-16", measurements: { weight: "85.5", fat: "24.7", muscle: "37.9", water: "56.5" } },
  { date: "2026-08-23", measurements: { weight: "85.1", fat: "24.6", muscle: "38", water: "56.7" } },
];

export function seedHistory() {
  try {
    const alreadySeeded = localStorage.getItem(SEED_FLAG);
    const existing = localStorage.getItem("measurementHistory");
    const isEmpty = !existing || existing === "[]" || existing === "null";

    if (!alreadySeeded && isEmpty) {
      localStorage.setItem("measurementHistory", JSON.stringify(seedMeasurementHistory));
      const last = seedMeasurementHistory[seedMeasurementHistory.length - 1];
      localStorage.setItem("oldMeasurements", JSON.stringify(last.measurements));
      localStorage.setItem(SEED_FLAG, "1");
    }
  } catch (err) {
    console.error("Failed to seed history:", err);
  }
}
