'use client';

import { useCallback, useEffect, useImperativeHandle, useRef, useState, forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { LocateFixed } from 'lucide-react';
import { DEFAULT_COORDS } from '@/page/home/model/defaultLocationData';

interface KakaoMapPickerProps {
  onLocationSelect: (location: { lat: number; lon: number; name: string }) => void;
}

export interface KakaoMapPickerRef {
  moveTo: (lat: number, lon: number) => void;
}

const FONT = "var(--font-inter), 'Inter', sans-serif";

const KakaoMapPicker = forwardRef<KakaoMapPickerRef, KakaoMapPickerProps>(
  ({ onLocationSelect }, ref) => {
  const { t } = useTranslation();
  // 1) 지도를 렌더링할 DOM 컨테이너.
  // kakao.maps.Map 생성 시 이 DOM 노드가 반드시 필요하다.
  const containerRef = useRef<HTMLDivElement>(null);
  // 2) 지도 관련 인스턴스 캐시.
  // mapRef: 지도 인스턴스 / markerRef: 현재 위치 핀 / geocoderRef: 좌표<->주소 변환기.
  // re-render가 일어나도 인스턴스를 재생성하지 않기 위해 ref에 보관한다.
  const mapRef = useRef<kakao.maps.Map | null>(null);
  const markerRef = useRef<kakao.maps.Marker | null>(null);
  const geocoderRef = useRef<kakao.maps.services.Geocoder | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>('');
  const [locating, setLocating] = useState(false);
  const [mapCreated, setMapCreated] = useState(false);
  const onLocationSelectRef = useRef(onLocationSelect);

  // 부모 콜백(onLocationSelect)이 변경돼도 지도 이벤트 콜백에서 최신 함수를 쓰기 위한 동기화.
  useEffect(() => {
    onLocationSelectRef.current = onLocationSelect;
  }, [onLocationSelect]);

  // 3) reverseGeocode: 좌표(lat/lng)를 주소 문자열로 바꾸는 역지오코딩.
  // 성공하면 화면 주소(selectedAddress)와 부모 상태(onLocationSelect)를 동시에 갱신한다.
  const reverseGeocode = useCallback((lat: number, lng: number) => {
    if (!geocoderRef.current) return;
    geocoderRef.current.coord2Address(lng, lat, (result, status) => {
      if (status === kakao.maps.services.Status.OK && result[0]) {
        const addr =
          result[0].road_address?.address_name ?? result[0].address?.address_name ?? '';
        setSelectedAddress(addr);
        onLocationSelectRef.current({ lat, lon: lng, name: addr });
      }
    });
  }, []);

  const ensureMap = useCallback(
    (lat: number, lon: number) => {
      if (typeof kakao === 'undefined' || !kakao.maps) return;

      // SDK 로딩 타이밍 이슈를 피하려고 load 내부에서 지도 로직을 실행한다.
      kakao.maps.load(() => {
        if (!containerRef.current) return;

        const center = new kakao.maps.LatLng(lat, lon);

        if (!mapRef.current) {
          // 4-A) 첫 진입: 지도/마커/지오코더 인스턴스를 한 번만 생성.
          const map = new kakao.maps.Map(containerRef.current, { center, level: 3 });
          const marker = new kakao.maps.Marker({ position: center, map, draggable: true });
          const geocoder = new kakao.maps.services.Geocoder();

          mapRef.current = map;
          markerRef.current = marker;
          geocoderRef.current = geocoder;

          // 지도 클릭 시 클릭 좌표로 마커 이동 -> 역지오코딩 -> 부모/화면 상태 반영.
          kakao.maps.event.addListener(map, 'click', (mouseEvent) => {
            if (!mouseEvent?.latLng) return;
            const latlng = mouseEvent.latLng;
            marker.setPosition(latlng);
            reverseGeocode(latlng.getLat(), latlng.getLng());
          });

          setMapCreated(true);
        } else {
          // 4-B) 이미 지도 인스턴스가 있으면 재생성하지 않고 중심/마커만 이동.
          mapRef.current.panTo(center);
          markerRef.current?.setPosition(center);
        }

        // 최종 좌표를 기준으로 주소를 맞춘다(검색 이동/현재 위치/초기 진입 공통).
        reverseGeocode(lat, lon);
      });
    },
    [reverseGeocode],
  );

  // 5) 현재 위치 버튼 핸들러.
  // geolocation 좌표를 받아 ensureMap으로 넘기고, 실패해도 locating 상태는 해제한다.
  const handleCurrentLocation = useCallback(() => {
    if (typeof navigator === 'undefined' || !navigator.geolocation) return;
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        ensureMap(pos.coords.latitude, pos.coords.longitude);
        setLocating(false);
      },
      () => {
        setLocating(false);
      },
    );
  }, [ensureMap]);

  useImperativeHandle(ref, () => ({
    // 6) 부모가 ref로 호출하는 공개 API.
    // 검색 결과 선택 시 mapRef.current?.moveTo(lat, lon)으로 지도 이동.
    moveTo(lat: number, lon: number) {
      ensureMap(lat, lon);
    },
  }));

  // 7) 최초 진입 시 시스템 기본 좌표(서울)로 지도 초기화.
  // 사용자가 조작하지 않아도 기본 지역이 바로 보이도록 한다.
  useEffect(() => {
    if (mapRef.current) return;
    ensureMap(DEFAULT_COORDS.latitude, DEFAULT_COORDS.longitude);
  }, [ensureMap]);

    return (
      <div className="mb-4">
        <div className="relative">
          <div
            ref={containerRef}
            className="kakao-map-picker"
            style={{
              width: '100%',
              height: '250px',
              borderRadius: '16px',
              overflow: 'hidden',
              backgroundColor: '#F2EDE4',
              overscrollBehavior: 'contain',
            }}
          />
          {!mapCreated && (
            <div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              style={{ borderRadius: '16px' }}
            >
              <p className="text-[#999]" style={{ fontFamily: FONT, fontSize: '13px' }}>
                {t('home.tapToSelectLocation')}
              </p>
            </div>
          )}
          <button
            type="button"
            onClick={handleCurrentLocation}
            disabled={locating}
            className="absolute bottom-3 right-3 z-10 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-label={t('home.currentLocation')}
          >
            <LocateFixed size={18} color={locating ? '#999' : '#333'} strokeWidth={1.8} />
          </button>
        </div>
        <p
          className="text-[#555555] mt-2 text-center"
          style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400 }}
        >
          {selectedAddress || t('home.tapToSelectLocation')}
        </p>
      </div>
    );
  },
);

KakaoMapPicker.displayName = 'KakaoMapPicker';

export default KakaoMapPicker;
