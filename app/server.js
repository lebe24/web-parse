// app.js
const express = require('express');
const app = express();
const parseRoute = require('./routes/route');

app.use(express.json());

// CORS middleware for API-only backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;

  let capturedJsonResponse = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
    if (capturedJsonResponse) {
      logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
    }

    if (logLine.length > 80) {
      logLine = logLine.slice(0, 79) + "…";
    }

    console.log(logLine);
  });

  next();

})


app.get('/', (req, res) => {
  res.send('Welcome to the Web Parser API');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.use('/parse', parseRoute);

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("Global error handler:", err);
  res.status(500).json({ error: "Internal server error" });
});

const PORT = 5000;
app.listen(PORT, "0.0.0.0", () => {
  const formattedTime = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit", 
    second: "2-digit",
    hour12: true,
  }).format(new Date());

  console.log(`${formattedTime} [WebParse API] serving on port ${PORT}`);
  console.log(`${formattedTime} [TaskFlow API] visit http://localhost:${PORT} for API documentation`);
});

