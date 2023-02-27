const express = require('express');
const { saveImage } = require('./controllers');

const router = new express.Router();

/**
 * @route   POST /upload/pinJSONToIPFS/land
 * @desc    upload land json to ipfs
 * @access  Public
 */

router.post('/images/upload', saveImage);

module.exports = router;
