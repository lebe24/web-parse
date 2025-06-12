// routes/parse.js
const express = require('express');
const router = express.Router();
const parsers = require('../parser/index.js'); // correct the path to your parsers folder

// Health check endpoint
router.get('/', async(req, res) => {
  return res.status(200).json(
    { 
        app: "this is an n8n-parser" 
    });
});

router.post('/', async (req, res) => {
  const { site, url } = req.body;

  if (!site || !url) {
    return res.status(400).json({ error: 'Missing site or url parameter' });
  }

  const parser = parsers[site.toLowerCase()];
  if (!parser) {
    return res.status(404).json({ error: `No parser found for site: ${site}` });
  }

  try {
    const data = await parser(url);
    return res.json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Parsing failed', details: err.message });
  }
});

module.exports = router;
