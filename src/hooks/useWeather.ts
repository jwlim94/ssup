"use client";

import { useWeatherContext } from "@/contexts/WeatherContext";

/**
 * 날씨 정보를 사용하는 훅
 *
 * 사용 예시:
 * const { weather, temperature, isNight, isLoading } = useWeather();
 */
export function useWeather() {
  const { weather, weatherData, isLoading, error, refresh } =
    useWeatherContext();

  return {
    // 날씨 타입 (clear, rain, snow, etc.)
    weather,

    // 상세 날씨 데이터
    temperature: weatherData?.temperature ?? null,
    description: weatherData?.description ?? null,
    isNight: weatherData?.isNight ?? false,
    cityName: weatherData?.cityName ?? null,

    // 상태
    isLoading,
    error,

    // 수동 갱신
    refresh,
  };
}
