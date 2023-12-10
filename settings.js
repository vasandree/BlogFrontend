const express = require('express');
const path = require('path');
const app = express();

app.use('/scripts', express.static('scripts'));

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});