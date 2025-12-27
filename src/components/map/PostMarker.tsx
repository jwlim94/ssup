"use client";

import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";
import Link from "next/link";
import { ROUTES } from "@/lib/constants";
import { formatRelativeTime } from "@/lib/utils/time";

interface Post {
  id: string;
  content: string;
  latitude: number;
  longitude: number;
  nickname: string;
  created_at: string;
}

interface PostMarkerProps {
  post: Post;
}

// 커스텀 마커 아이콘
const postIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function PostMarker({ post }: PostMarkerProps) {
  return (
    <Marker position={[post.latitude, post.longitude]} icon={postIcon}>
      <Popup>
        <div className="min-w-[200px] max-w-[250px]">
          <p className="text-sm text-gray-800 line-clamp-3 mb-2">
            {post.content}
          </p>
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>{post.nickname}</span>
            <span>{formatRelativeTime(post.created_at)}</span>
          </div>
          <Link
            href={ROUTES.POST_DETAIL(post.id)}
            className="block w-full text-center py-1.5 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
          >
            View Post
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
