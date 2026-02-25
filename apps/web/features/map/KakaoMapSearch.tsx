'use client';

import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, ArrowRight } from 'lucide-react';

interface KakaoMapSearchProps {
  onSelect: (place: { lat: number; lon: number; name: string }) => void;
}

const FONT = "var(--font-inter), 'Inter', sans-serif";

const KakaoMapSearch = ({ onSelect }: KakaoMapSearchProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<kakao.maps.services.PlaceResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const placesRef = useRef<kakao.maps.services.Places | null>(null);

  const handleSearch = () => {
    if (!query.trim()) return;
    if (typeof kakao === 'undefined' || !kakao.maps) return;
    kakao.maps.load(() => {
      if (!kakao.maps.services) return;

      if (!placesRef.current) {
        placesRef.current = new kakao.maps.services.Places();
      }

      placesRef.current.keywordSearch(query.trim(), (result, status) => {
        if (status === kakao.maps.services.Status.OK) {
          setResults(result);
          setShowResults(true);
          setNoResults(false);
        } else {
          setResults([]);
          setShowResults(true);
          setNoResults(true);
        }
      });
    });
  };

  const handleSelect = (place: kakao.maps.services.PlaceResult) => {
    setShowResults(false);
    setQuery(place.place_name);
    onSelect({
      lat: parseFloat(place.y),
      lon: parseFloat(place.x),
      name: place.address_name,
    });
  };

  return (
    <div className="relative mb-3">
      <div className="flex items-center gap-2">
        <div
          className="flex-1 flex items-center gap-2 px-4 py-3"
          style={{ borderRadius: '16px', border: '1.5px solid #E5E5E5' }}
        >
          <Search size={16} color="#999" strokeWidth={1.5} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleSearch();
            }}
            placeholder={t('home.searchLocation')}
            className="flex-1 outline-none text-black"
            style={{ fontFamily: FONT, fontSize: '14px', fontWeight: 400 }}
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={!query.trim()}
            className="shrink-0 transition-opacity disabled:opacity-40"
            aria-label={t('common.search')}
          >
            <ArrowRight size={16} color="#555555" strokeWidth={1.8} />
          </button>
        </div>
      </div>
      {showResults && (
        <div
          className="absolute left-0 right-0 bg-white z-10 mt-1 max-h-[200px] overflow-y-auto"
          style={{
            borderRadius: '12px',
            border: '1px solid #E5E5E5',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          }}
        >
          {noResults ? (
            <p
              className="px-4 py-3 text-[#999]"
              style={{ fontFamily: FONT, fontSize: '13px' }}
            >
              {t('home.noSearchResults')}
            </p>
          ) : (
            results.map((place) => (
              <button
                key={place.id}
                className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-[#f0f0f0] last:border-b-0"
                onClick={() => handleSelect(place)}
              >
                <p
                  className="text-black"
                  style={{ fontFamily: FONT, fontSize: '13px', fontWeight: 500 }}
                >
                  {place.place_name}
                </p>
                <p
                  className="text-[#999]"
                  style={{ fontFamily: FONT, fontSize: '12px', fontWeight: 400 }}
                >
                  {place.address_name}
                </p>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default KakaoMapSearch;
