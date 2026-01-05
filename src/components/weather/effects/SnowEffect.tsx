"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { InstancedMesh, Vector3, Matrix4 } from "three";

interface Snowflake {
  position: Vector3;
  velocity: Vector3;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const SNOWFLAKE_COUNT = 200; // 데스크톱용 (나중에 모바일은 50개로 조절)
const FALL_SPEED = 0.02;
const WIND_STRENGTH = 0.01;

export function SnowEffect() {
  const meshRef = useRef<InstancedMesh>(null);
  const snowflakesRef = useRef<Snowflake[]>([]);

  // 눈송이 초기화
  useEffect(() => {
    const flakes: Snowflake[] = [];

    for (let i = 0; i < SNOWFLAKE_COUNT; i++) {
      flakes.push({
        position: new Vector3(
          (Math.random() - 0.5) * 20, // X: -10 ~ 10
          Math.random() * 20 + 10, // Y: 10 ~ 30 (위에서 시작)
          (Math.random() - 0.5) * 20 // Z: -10 ~ 10
        ),
        velocity: new Vector3(
          (Math.random() - 0.5) * WIND_STRENGTH, // 바람 효과
          -FALL_SPEED - Math.random() * 0.01, // 떨어지는 속도 (다양하게)
          0
        ),
        size: 0.05 + Math.random() * 0.1, // 크기 다양하게
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02,
      });
    }

    snowflakesRef.current = flakes;
  }, []);

  // 매 프레임 업데이트
  useFrame((state, delta) => {
    if (!meshRef.current) return;

    const flakes = snowflakesRef.current;

    flakes.forEach((flake, i) => {
      // 위치 업데이트
      flake.position.add(flake.velocity.clone().multiplyScalar(delta * 60));

      // 회전 업데이트
      flake.rotation += flake.rotationSpeed * delta * 60;

      // 바닥에 닿으면 위로 리셋
      if (flake.position.y < -10) {
        flake.position.y = 20;
        flake.position.x = (Math.random() - 0.5) * 20;
        flake.position.z = (Math.random() - 0.5) * 20;
      }

      // 좌우로 벗어나면 반대편으로
      if (flake.position.x > 10) {
        flake.position.x = -10;
      } else if (flake.position.x < -10) {
        flake.position.x = 10;
      }

      // InstancedMesh에 위치/회전 적용
      if (meshRef.current) {
        const matrix = new Matrix4();
        matrix.makeRotationZ(flake.rotation);
        matrix.setPosition(
          flake.position.x,
          flake.position.y,
          flake.position.z
        );
        meshRef.current.setMatrixAt(i, matrix);
      }
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, SNOWFLAKE_COUNT]}>
      {/* 눈송이 모양 (작은 원판) */}
      <circleGeometry args={[0.1, 8]} />
      <meshStandardMaterial
        color="#ffffff"
        transparent
        opacity={0.8}
        emissive="#ffffff"
        emissiveIntensity={0.2}
      />
    </instancedMesh>
  );
}
