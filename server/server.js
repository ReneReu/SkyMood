const express = require("express");
const cors = require("cors");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

/*
  Example route: GET /api/weather?lat=52.5200&lon=13.4049 (Berlin)
  The Open-Meteo endpoint for daily data including weathercode, sunrise, sunset:
  https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&daily=weathercode,sunrise,sunset&current_weather=true
*/
app.get("/api/weather", async (req, res) => {
  try {
    // 1) Get latitude & longitude from query params or default to something
    const lat = req.query.lat || '40.7128';  // default to NYC
    const lon = req.query.lon || '-74.0060';

    // URL with daily weathercode, sunrise, sunset, plus "current_weather" to get current temp/time
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,sunrise,sunset&current_weather=true&timezone=auto`;

    // fetch data
    const response = await axios.get(openMeteoUrl);
    const weatherData = response.data;

    // send data back to client
    res.json(weatherData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch data from Open-Meteo" });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
