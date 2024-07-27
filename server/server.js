const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.post('/save-measurements', (req, res) => {
  const { newMeasurements, date } = req.body;
  const data = `Date: ${date}, Weight: ${newMeasurements.weight}, Fat: ${newMeasurements.fat}, Muscle: ${newMeasurements.muscle}, Water: ${newMeasurements.water}\n`;

  fs.appendFile(path.join(__dirname, 'measurements.txt'), data, (err) => {
    if (err) {
      console.error('Failed to save measurements', err);
      return res.status(500).send('Internal Server Error');
    }
    res.status(200).send('Measurements saved');
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
