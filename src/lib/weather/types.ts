// 우리 앱에서 사용할 날씨 타입
export type WeatherType =
  | "clear" // 맑음
  | "cloudy" // 흐림
  | "rain" // 비
  | "snow" // 눈
  | "thunderstorm" // 천둥번개
  | "fog"; // 안개

// OpenWeatherMap API 응답 타입
export interface OpenWeatherResponse {
  weather: Array<{
    id: number;
    main: string;
    description: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  sys: {
    sunrise: number;
    sunset: number;
  };
  name: string;
}

// 우리 앱에서 사용할 날씨 데이터
export interface WeatherData {
  type: WeatherType;
  temperature: number;
  description: string;
  isNight: boolean;
  cityName: string;
}
