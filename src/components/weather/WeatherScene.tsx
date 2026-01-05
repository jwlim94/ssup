"use client";

import { useWeather } from "@/hooks/useWeather";
import { SnowEffect } from "./effects/SnowEffect";
// import { RainEffect } from "./effects/RainEffect";

export function WeatherScene() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { weather, isNight } = useWeather(); // 🧪 임시: weather 사용 안 함

  // 🧪 임시: 날씨 정보 없어도 렌더링 (나중에 if (!weather) return null; 복구)
  // if (!weather) return null;

  return (
    <>
      {/* 기본 조명 */}
      <ambientLight intensity={isNight ? 0.3 : 0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={isNight ? 0.2 : 0.5}
      />

      {/* 날씨별 효과 */}
      {/* 🧪 임시: 항상 눈 효과 표시 (나중에 weather === "snow"로 변경) */}
      <SnowEffect />
      {/* {weather === "snow" && <SnowEffect />} */}
      {/* {weather === "rain" && <RainEffect />} */}

      {/* 테스트용 박스 (임시로 숨김) */}
      {/* {weather !== "snow" && (
        <mesh rotation={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial
            color={
              weather === "rain"
                ? "#5a7d9a"
                : weather === "clear"
                ? "#ffd700"
                : "#888888"
            }
          />
        </mesh>
      )} */}
    </>
  );
}
