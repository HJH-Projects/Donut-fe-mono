import type {
  Gender,
  RecommendationParams,
  RecommendationResponse,
} from "./recommendations.types";

const API_BASE_URL =
  process.env.API_SOURCE_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://localhost:8080";

const getSecondsUntilNextKst0430 = () => {
  const now = new Date();
  const kstOffsetMs = 9 * 60 * 60 * 1000;
  const nowKst = new Date(now.getTime() + kstOffsetMs);
  const next = new Date(nowKst);
  next.setHours(4, 30, 0, 0);
  if (nowKst >= next) {
    next.setDate(next.getDate() + 1);
  }
  const diffSeconds = Math.floor((next.getTime() - nowKst.getTime()) / 1000);
  return Math.max(diffSeconds, 60);
};

const pickRandomGender = (): Gender =>
  Math.random() < 0.5 ? "MALE" : "FEMALE";

const buildSearchParams = (params?: RecommendationParams) => {
  const searchParams: Record<string, string> = {
    gender: pickRandomGender(),
  };

  if (typeof params?.latitude === "number") {
    searchParams.latitude = params.latitude.toString();
  }
  if (typeof params?.longitude === "number") {
    searchParams.longitude = params.longitude.toString();
  }

  return searchParams;
};

export const recommendLookServer = async (params?: RecommendationParams) => {
  const searchParams = new URLSearchParams(buildSearchParams(params));

  const upstreamUrl = `${API_BASE_URL}/recommendations/look?${searchParams.toString()}`;
  const ttl = getSecondsUntilNextKst0430();

  // 3. 직접 호출 및 캐싱 설정
  const response = await fetch(upstreamUrl, {
    next: { revalidate: ttl }, // 여기서 TTL 설정
  });

  if (!response.ok) return null;
  return response.json() as Promise<RecommendationResponse>;
};
