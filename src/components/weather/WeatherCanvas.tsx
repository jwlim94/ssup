"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { WeatherScene } from "./WeatherScene";

interface WeatherCanvasProps {
  className?: string;
}

export function WeatherCanvas({ className = "" }: WeatherCanvasProps) {
  return (
    <div
      className={`fixed inset-0 pointer-events-none z-[100] ${className}`}
      aria-hidden="true"
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        dpr={[1, 2]} // 성능 최적화: 디바이스 픽셀 비율 제한
        performance={{ min: 0.5 }} // 성능 저하 시 자동 품질 조절
        gl={{ antialias: true, alpha: true }} // 투명 배경
        style={{ pointerEvents: "none" }} // 클릭 통과
      >
        <Suspense fallback={null}>
          <WeatherScene />
        </Suspense>
      </Canvas>
    </div>
  );
}
