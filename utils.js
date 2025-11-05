const { pool } = require('./db');

async function insertUsers(users) {
  for (const user of users) {
    const { name, age, ...rest } = user;
    const fullName = `${name.firstName} ${name.lastName}`;
    const address = user.address || {};
    const additional = { ...rest };
    delete additional.name;
    delete additional.address;
    delete additional.age;

    await pool.query(
      `INSERT INTO users (name, age, address, additional_info)
       VALUES ($1, $2, $3, $4)`,
      [fullName, parseInt(age), address, additional]
    );
  }
}

async function printAgeDistribution() {
  const res = await pool.query('SELECT age FROM users');
  const ages = res.rows.map(r => r.age);
  const groups = { '<20': 0, '20-40': 0, '40-60': 0, '>60': 0 };

  ages.forEach(age => {
    if (age < 20) groups['<20']++;
    else if (age <= 40) groups['20-40']++;
    else if (age <= 60) groups['40-60']++;
    else groups['>60']++;
  });

  const total = ages.length;
  console.log('\nAge-Group % Distribution\n');
  for (const [range, count] of Object.entries(groups)) {
    const percent = ((count / total) * 100).toFixed(2);
    console.log(`${range}: ${percent}%`);
  }
}

module.exports = { insertUsers, printAgeDistribution };
