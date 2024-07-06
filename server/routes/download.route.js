const express = require('express');
const path = require('path');
const router = express.Router();

router.get('/cv/:filename', (req, res) => {
  const file = path.join(__dirname, '..', 'CVs', req.params.filename);
  console.log(file, 'file');
  console.log('Attempting to access file:', file);

  res.sendFile(file, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      if (err.code === 'ENOENT') {
        return res.status(404).send('File not found');
      }
      res.status(500).send('Error sending file');
    }
  });
});

module.exports = router;
