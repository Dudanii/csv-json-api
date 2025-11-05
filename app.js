const express = require('express');
const dotenv = require('dotenv');
const { parseCSV } = require('./parser');
const { insertUsers, printAgeDistribution } = require('./utils');

dotenv.config();
const app = express();

app.get('/upload', async (req, res) => {
  try {
    const users = parseCSV(process.env.CSV_FILE_PATH);
    await insertUsers(users);
    await printAgeDistribution();
    res.send('Data uploaded and report printed.');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error uploading data.');
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
