// app.js
const express = require('express');
const app = express();
const parseRoute = require('./routes/parse');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Web Parser API');
});

app.use('/parse', parseRoute);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
