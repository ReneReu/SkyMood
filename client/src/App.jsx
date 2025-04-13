import { useState, useEffect } from "react";
import "./App.css";

// Simple map from Open-Meteo weathercode to a "condition name"
function mapWeatherCode(code) {
  if (code === 0) return "clear";
  if (code >= 1 && code <= 3) return "clouds";
  if (code >= 45 && code <= 48) return "fog";
  if (code >= 51 && code <= 67) return "rain";    // drizzle/rain
  if (code >= 71 && code <= 77) return "snow"; 
  if (code >= 80 && code <= 82) return "rain";    // rain showers
  if (code === 95) return "thunderstorm";
  if (code === 96 || code === 99) return "hail";
  return "unknown";
}

function App() {
  const [weatherData, setWeatherData] = useState(null);

  const [bgVideoSrc, setBgVideoSrc] = useState("/videos/test.mp4"); //initial value
  const [overlayVideoSrc, setOverlayVideoSrc] = useState(null);
  const [overlayVideoSrc2, setOverlayVideoSrc2] = useState(null);
  

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        // You can pass lat/lon in query if you want different locations:
        // e.g. `http://localhost:4000/api/weather?lat=52.5200&lon=13.4049`
        const response = await fetch("http://localhost:4000/api/weather?lat=52.5200&lon=13.4049");
        const data = await response.json();
        setWeatherData(data);
      } catch (err) {
        console.error("Error fetching weather data:", err);
      }
    };
    fetchWeather();
  }, []);

  useEffect(() => {
    if (!weatherData) return;

    // Extract data
    // "current_weather" has: { temperature, weathercode, time }
    const currentCode = weatherData.current_weather.weathercode;
    const mappedCondition = mapWeatherCode(currentCode);

    // parse day/night from daily.sunrise[0], daily.sunset[0], and current_weather.time
    const sunriseStr = weatherData.daily.sunrise[0]; // "2025-03-22T06:03"
    const sunsetStr = weatherData.daily.sunset[0];
    const currentTimeStr = weatherData.current_weather.time;

    // Convert these strings to JS Date objects
    const sunrise = new Date(sunriseStr);
    const sunset = new Date(sunsetStr);
    const currentTime = new Date(currentTimeStr);
    const isDaytime = currentTime >= sunrise && currentTime < sunset;

    if (isDaytime) {
      setBgVideoSrc("/videos/test.mp4");
    } else {
      setBgVideoSrc("/videos/test.mp4");
    }
    setOverlayVideoSrc("/videos/overlays/sun.webm");
    setOverlayVideoSrc2("/videos/overlays/flare4.webm");

  }, [weatherData]);



  return (
    <div className="app-container">
      <video 
        className="video-layer background-video"
        src={bgVideoSrc} autoPlay loop muted
      />
      {overlayVideoSrc && (
      <video
        className="video-layer overlay-video"
        src={overlayVideoSrc} autoPlay loop muted
      />
      )}
      <video
        className="video-layer overlay-video2"
        src={overlayVideoSrc2} autoPlay loop muted
      />

      <div className="content">
        <h1>Sky</h1>
        {weatherData ? (
          <div>
            <p>Current Temp: {weatherData.current_weather.temperature}°C</p>
            <p>Weather Code: {weatherData.current_weather.weathercode}</p>
            <p>Time: {weatherData.current_weather.time}</p>
            <p>Sunrise: {weatherData.daily.sunrise[0]}</p>
            <p>Sunset: {weatherData.daily.sunset[0]}</p>
          </div>
        ) : (
          <p>Loading weather data...</p>
        )}
      </div>
    </div>
  );
}

export default App;
