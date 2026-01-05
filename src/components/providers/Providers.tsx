"use client";

import { ReactNode } from "react";
import { WeatherProvider } from "@/contexts/WeatherContext";
import { WeatherCanvas } from "@/components/weather/WeatherCanvas";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <WeatherProvider>
      {/* 날씨 효과 캔버스 (콘텐츠 위, 클릭 통과) */}
      <WeatherCanvas />
      {children}
    </WeatherProvider>
  );
}
