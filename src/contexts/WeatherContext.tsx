"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useLocation } from "@/hooks/useLocation";
import { getWeather } from "@/lib/weather/api";
import { WeatherData, WeatherType } from "@/lib/weather/types";
import { WEATHER_CONFIG } from "@/lib/constants";

interface WeatherContextValue {
  weather: WeatherType | null;
  weatherData: WeatherData | null;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
}

const WeatherContext = createContext<WeatherContextValue | null>(null);

interface WeatherProviderProps {
  children: ReactNode;
}

export function WeatherProvider({ children }: WeatherProviderProps) {
  const { coordinates } = useLocation();
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = useCallback(async () => {
    if (!coordinates) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await getWeather(
        coordinates.latitude,
        coordinates.longitude
      );

      if (data) {
        setWeatherData(data);
      } else {
        setError("Failed to fetch weather data");
      }
    } catch (err) {
      setError("Failed to fetch weather data");
      console.error("Weather fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, [coordinates]);

  // 초기 fetch + 좌표 변경 시 fetch
  useEffect(() => {
    fetchWeather();
  }, [fetchWeather]);

  // 30분마다 자동 갱신
  useEffect(() => {
    if (!coordinates) return;

    const interval = setInterval(() => {
      fetchWeather();
    }, WEATHER_CONFIG.REFRESH_INTERVAL_MS);

    return () => clearInterval(interval);
  }, [coordinates, fetchWeather]);

  const value: WeatherContextValue = {
    weather: weatherData?.type ?? null,
    weatherData,
    isLoading,
    error,
    refresh: fetchWeather,
  };

  return (
    <WeatherContext.Provider value={value}>{children}</WeatherContext.Provider>
  );
}

export function useWeatherContext() {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error("useWeatherContext must be used within a WeatherProvider");
  }
  return context;
}
