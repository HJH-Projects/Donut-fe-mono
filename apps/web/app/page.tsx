import { cookies } from "next/headers";
import { HomePage } from "@/page/home/ui/HomePage";
import {
  getLocationsServer,
  getWeatherByLocationServer,
} from "@/shared/api/locations";
import { recommendLookServer } from "@/shared/api/recommendations.server";

const getDefaultLocation = (
  locations: Awaited<ReturnType<typeof getLocationsServer>>,
) => {
  return locations.find((item) => item.isDefault) ?? locations[0];
};

const parseGeoCookie = (value?: string | null) => {
  if (!value) return null;
  const [latRaw, lonRaw] = value.split(",");
  const latitude = Number(latRaw);
  const longitude = Number(lonRaw);
  if (Number.isNaN(latitude) || Number.isNaN(longitude)) return null;
  return { latitude, longitude };
};

export default async function Page() {
  const cookieStore = await cookies();
  const geoCookie = cookieStore.get("geo")?.value ?? null;
  const isAuthed = Boolean(cookieStore.get("accessToken")?.value);
  const geo = parseGeoCookie(geoCookie);
  console.log("[geo] cookie (server):", geoCookie);
  console.log("[geo] parsed (server):", geo);
  const locations = await getLocationsServer();
  const defaultLocation = getDefaultLocation(locations);
  const weather =
    isAuthed && defaultLocation
      ? await getWeatherByLocationServer(defaultLocation.location.id)
      : null;
  const recommendation =
    isAuthed && defaultLocation
      ? await recommendLookServer({
          latitude: geo?.latitude ?? defaultLocation.location.lat,
          longitude: geo?.longitude ?? defaultLocation.location.lon,
        })
      : geo
        ? await recommendLookServer({
            latitude: geo.latitude,
            longitude: geo.longitude,
          })
        : await recommendLookServer();

  const locationName = geo ? "현재 위치" : defaultLocation?.location.name;

  return (
    <HomePage
      locationName={locationName}
      weather={weather}
      recommendation={recommendation}
      hasGeo={Boolean(geo)}
    />
  );
}
