const express = require('express');
const router = express.Router();
const PDFFile = require('../models/pdfFile.model');
const CAFile = require('../models/caFile.model');

router.get('/pdf', async (req, res) => {
    try {
        // const pdfFiles = await PDFFile.find();
        res.json({ status: 'OK', message: 'PDF files fetched successfully', data: [] });
    } catch (err) {
        console.error(err);
        res.json({ status: 'ERROR', error: 'Failed to fetch PDF files' });
    }
});


module.exports = router; // Export the router for use in the main app