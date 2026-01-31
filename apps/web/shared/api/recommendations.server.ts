import { randomInt } from "crypto";
import type {
  Gender,
  RecommendationParams,
  RecommendationResponse,
} from "./recommendations.types";
import { serverKy } from "./server";

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

const pickRandomGender = (): Gender => (randomInt(0, 2) === 0 ? "MALE" : "FEMALE");

const normalizeCoord = (value: number) => value.toFixed(2);

const fetchRecommendation = async (
  lat: string,
  lon: string,
  gender: Gender,
  ttl: number
): Promise<RecommendationResponse | null> => {
  const searchParams = new URLSearchParams({ gender });
  if (lat !== "default") {
    searchParams.set("latitude", lat);
  }
  if (lon !== "default") {
    searchParams.set("longitude", lon);
  }

  const response = await serverKy.get("recommendations/look", {
    searchParams,
    cache: "force-cache",
    next: { revalidate: ttl },
    timeout: 60000,
  } as RequestInit & { searchParams: URLSearchParams });

  if (!response.ok) return null;
  return response.json();
};

export const recommendLookServer = async (params?: RecommendationParams) => {
  const lat = typeof params?.latitude === "number" ? normalizeCoord(params.latitude) : "default";
  const lon = typeof params?.longitude === "number" ? normalizeCoord(params.longitude) : "default";
  const gender = pickRandomGender();

  const ttl = getSecondsUntilNextKst0430();
  return fetchRecommendation(lat, lon, gender, ttl);
};
