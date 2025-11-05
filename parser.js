const fs = require('fs');

function setNestedValue(obj, path, value) {
  let current = obj;
  for (let i = 0; i < path.length - 1; i++) {
    if (!current[path[i]]) current[path[i]] = {};
    current = current[path[i]];
  }
  current[path[path.length - 1]] = value;
}

function parseCSV(filePath) {
  const data = fs.readFileSync(filePath, 'utf8').trim();
  const lines = data.split('\n');
  const headers = lines[0].split(',').map(h => h.trim());

  const records = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const record = {};
    headers.forEach((key, idx) => {
      setNestedValue(record, key.split('.'), values[idx]);
    });
    records.push(record);
  }
  return records;
}

module.exports = { parseCSV };
