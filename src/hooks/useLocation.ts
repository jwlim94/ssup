"use client";

import { useState, useEffect, useCallback } from "react";
import type { LocationState, PermissionState } from "@/types/location";

const DEFAULT_OPTIONS: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 60000, // 1분간 캐시
};

/**
 * 사용자 위치를 관리하는 훅
 *
 * 사용 예시:
 * const { coordinates, loading, error, permission, refresh } = useLocation();
 */
export function useLocation() {
  const [state, setState] = useState<LocationState>({
    coordinates: null,
    loading: true,
    error: null,
    permission: null,
  });

  // 위치 가져오기
  const getPosition = useCallback(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        loading: false,
        error: "Geolocation is not supported by your browser",
      }));
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setState({
          coordinates: {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          loading: false,
          error: null,
          permission: "granted",
        });
      },
      (error) => {
        let errorMessage = "Failed to get location";
        let permission: PermissionState = "denied";

        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location permission denied";
            permission = "denied";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable";
            break;
          case error.TIMEOUT:
            errorMessage = "Location request timed out";
            break;
        }

        setState({
          coordinates: null,
          loading: false,
          error: errorMessage,
          permission,
        });
      },
      DEFAULT_OPTIONS
    );
  }, []);

  // 권한 상태 확인
  useEffect(() => {
    if (!navigator.permissions) {
      getPosition();
      return;
    }

    navigator.permissions
      .query({ name: "geolocation" })
      .then((result) => {
        setState((prev) => ({
          ...prev,
          permission: result.state as PermissionState,
        }));

        if (result.state === "granted") {
          getPosition();
        } else if (result.state === "prompt") {
          setState((prev) => ({ ...prev, loading: false }));
        } else {
          setState((prev) => ({
            ...prev,
            loading: false,
            error: "Location permission denied",
          }));
        }

        // 권한 변경 감지
        result.onchange = () => {
          setState((prev) => ({
            ...prev,
            permission: result.state as PermissionState,
          }));
          if (result.state === "granted") {
            getPosition();
          }
        };
      })
      .catch(() => {
        getPosition();
      });
  }, [getPosition]);

  return {
    ...state,
    refresh: getPosition,
  };
}
