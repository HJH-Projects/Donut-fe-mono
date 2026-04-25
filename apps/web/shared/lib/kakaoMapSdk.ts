let kakaoMapSdkPromise: Promise<void> | null = null;

const KAKAO_MAP_SCRIPT_ID = 'kakao-map-sdk';

const getKakaoMapSdkUrl = () => {
  const appKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY ?? '';
  return `//dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=services`;
};

export const isKakaoMapSdkReady = () => {
  return typeof window !== 'undefined' && typeof kakao !== 'undefined' && Boolean(kakao.maps);
};

export const loadKakaoMapSdk = () => {
  if (typeof window === 'undefined') return Promise.resolve();
  if (isKakaoMapSdkReady()) return Promise.resolve();
  if (kakaoMapSdkPromise) return kakaoMapSdkPromise;

  kakaoMapSdkPromise = new Promise<void>((resolve, reject) => {
    const onLoadComplete = () => {
      if (typeof kakao === 'undefined' || !kakao.maps?.load) {
        kakaoMapSdkPromise = null;
        reject(new Error('Kakao Map SDK is not available after script load.'));
        return;
      }
      kakao.maps.load(() => {
        resolve();
      });
    };

    const onLoadError = () => {
      kakaoMapSdkPromise = null;
      reject(new Error('Failed to load Kakao Map SDK script.'));
    };

    const existingScript = document.getElementById(KAKAO_MAP_SCRIPT_ID) as HTMLScriptElement | null;
    if (existingScript) {
      if (existingScript.dataset.loaded === 'true' || isKakaoMapSdkReady()) {
        onLoadComplete();
        return;
      }
      existingScript.addEventListener('load', onLoadComplete, { once: true });
      existingScript.addEventListener('error', onLoadError, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.id = KAKAO_MAP_SCRIPT_ID;
    script.src = getKakaoMapSdkUrl();
    script.async = true;
    script.addEventListener(
      'load',
      () => {
        script.dataset.loaded = 'true';
        onLoadComplete();
      },
      { once: true },
    );
    script.addEventListener('error', onLoadError, { once: true });
    document.head.appendChild(script);
  });

  return kakaoMapSdkPromise;
};
