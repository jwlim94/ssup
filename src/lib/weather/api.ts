import { WeatherType, OpenWeatherResponse, WeatherData } from "./types";

const API_KEY = process.env.NEXT_PUBLIC_OPEN_WEATHER_MAP_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

// OpenWeatherMap 날씨 코드 → WeatherType 매핑
// https://openweathermap.org/weather-conditions
function mapWeatherCode(code: number): WeatherType {
  if (code >= 200 && code < 300) return "thunderstorm"; // Thunderstorm
  if (code >= 300 && code < 400) return "rain"; // Drizzle
  if (code >= 500 && code < 600) return "rain"; // Rain
  if (code >= 600 && code < 700) return "snow"; // Snow
  if (code >= 700 && code < 800) return "fog"; // Atmosphere (fog, mist, etc.)
  if (code === 800) return "clear"; // Clear
  if (code > 800) return "cloudy"; // Clouds
  return "clear";
}

export async function getWeather(
  latitude: number,
  longitude: number
): Promise<WeatherData | null> {
  if (!API_KEY) {
    console.error("OpenWeatherMap API key is not set");
    return null;
  }

  try {
    const url = `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data: OpenWeatherResponse = await response.json();

    // 낮/밤 판단
    const now = Math.floor(Date.now() / 1000);
    const isNight = now < data.sys.sunrise || now > data.sys.sunset;

    return {
      type: mapWeatherCode(data.weather[0].id),
      temperature: Math.round(data.main.temp),
      description: data.weather[0].description,
      isNight,
      cityName: data.name,
    };
  } catch (error) {
    console.error("Failed to fetch weather:", error);
    return null;
  }
}
