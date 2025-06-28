// routes/route.js

const express = require('express');
const { rateLimit } = require('express-rate-limit')

const parsers = require('../parser/index.js'); // correct the path to your parsers folder
const appData = require('../data/info.json');

const router = express.Router();


const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: "Too many requests from this IP, please try again after 15 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

//GET Application information 
router.get('/', async(req, res) => { 
  return res.status(200).json(appData); 
});


// POST 
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
