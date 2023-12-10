const express = require('express');
const app = express();

app.use('/scripts', express.static('scripts'));

const port = 5500;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});