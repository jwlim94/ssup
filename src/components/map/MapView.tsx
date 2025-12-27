"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { LatLngExpression } from "leaflet";
import "leaflet/dist/leaflet.css";
import { APP_CONFIG } from "@/lib/constants";
import PostMarker from "./PostMarker";

interface Post {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  nickname: string;
  created_at: string;
}

interface MapViewProps {
  posts: Post[];
  userLocation: {
    latitude: number;
    longitude: number;
  };
}

// 지도 중심 업데이트 컴포넌트
function MapUpdater({ center }: { center: LatLngExpression }) {
  const map = useMap();

  useEffect(() => {
    map.setView(center);
  }, [map, center]);

  return null;
}

export default function MapView({ posts, userLocation }: MapViewProps) {
  const center: LatLngExpression = [
    userLocation.latitude,
    userLocation.longitude,
  ];

  return (
    <div className="w-full h-[calc(100vh-180px)] rounded-lg overflow-hidden border border-gray-200">
      <MapContainer
        center={center}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater center={center} />

        {/* 내 위치 반경 원 */}
        <Circle
          center={center}
          radius={APP_CONFIG.DEFAULT_RADIUS_METERS}
          pathOptions={{
            color: "#3B82F6",
            fillColor: "#3B82F6",
            fillOpacity: 0.1,
            weight: 2,
          }}
        />

        {/* 내 위치 마커 (픽셀 기반 - 줌에 관계없이 일정 크기) */}
        <CircleMarker
          center={center}
          radius={8}
          pathOptions={{
            color: "#ffffff",
            fillColor: "#3B82F6",
            fillOpacity: 1,
            weight: 3,
          }}
        />

        {/* 포스트 마커들 */}
        {posts.map((post) => (
          <PostMarker key={post.id} post={post} />
        ))}
      </MapContainer>
    </div>
  );
}
