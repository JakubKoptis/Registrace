const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const app = express();

const usersFilePath = path.join(__dirname, 'users.json');

let usersData = [];
if (fs.existsSync(usersFilePath)) {
  const rawData = fs.readFileSync(usersFilePath, 'utf-8');
  usersData = JSON.parse(rawData) || [];
}

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/validate', (req, res) => {
  const { username, email, password } = req.body;

  let errors = {};

  if (!/^[a-zA-Z0-9]+$/.test(username)) {
    errors.username = 'Uživatelské jméno může obsahovat pouze alfanumerické znaky.';
  } else if (usersData.some(user => user.username === username)) {
    errors.username = 'Toto uživatelské jméno je již zaregistrováno.';
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Email má nesprávný formát.';
  } else if (usersData.some(user => user.email === email)) {
    errors.email = 'Tento email je již zaregistrován.';
  }

  const hasMinLength = password.length >= 8;
  const hasTwoCriteria = [
    /[a-z]/.test(password),   
    /[A-Z]/.test(password),   
    /[0-9]/.test(password),   
    /[^a-zA-Z0-9]/.test(password) 
  ].filter(Boolean).length >= 2;
  const isVeryLong = password.length > 16;

  if (!(hasMinLength && (hasTwoCriteria || isVeryLong))) {
    errors.password = 'Heslo musí být minimálně 8 znaků dlouhé a splňovat alespoň 2 kritéria, nebo být delší než 16 znaků.';
  }

  if (Object.keys(errors).length > 0) {
    res.status(400).json(errors);
    return;
  }

  const newUser = { username, email, password };
  usersData.push(newUser);
  fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2));

  res.json({ message: 'Registrace byla úspěšná.', user: newUser });
});

app.listen(3000, () => {
  console.log('Server běží na http://localhost:3000');
});
