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
      <Popup className="custom-popup">
        <div className="w-[220px] -m-[13px] p-3">
          {/* Content */}
          <p className="text-sm text-gray-900 line-clamp-2 leading-snug">
            {post.content}
          </p>
          
          {/* Footer - 닉네임 & 시간 (오른쪽 정렬) */}
          <div className="flex items-center justify-end gap-1.5 mt-1.5 mb-2.5 text-xs text-gray-400">
            <span className="font-medium text-gray-500">{post.nickname}</span>
            <span>·</span>
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{formatRelativeTime(post.created_at)}</span>
          </div>
          
          {/* Button */}
          <Link
            href={ROUTES.POST_DETAIL(post.id)}
            className="block w-full py-2 text-center text-xs font-medium rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all"
            style={{ backgroundColor: '#2563eb', color: '#ffffff' }}
          >
            View Post
          </Link>
        </div>
      </Popup>
    </Marker>
  );
}
