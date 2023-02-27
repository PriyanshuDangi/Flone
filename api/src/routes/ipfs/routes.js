const express = require('express');
const { saveIPFS } = require('./controllers');

const router = new express.Router();

router.post('/upload', saveIPFS);

module.exports = router;
