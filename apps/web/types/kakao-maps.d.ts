declare namespace kakao.maps {
  function load(callback: () => void): void;

  class LatLng {
    constructor(lat: number, lng: number);
    getLat(): number;
    getLng(): number;
  }

  class Map {
    constructor(container: HTMLElement, options: { center: LatLng; level: number });
    setCenter(latlng: LatLng): void;
    panTo(latlng: LatLng): void;
    setLevel(level: number): void;
    getCenter(): LatLng;
    relayout(): void;
  }

  class Marker {
    constructor(options: { position: LatLng; map?: Map; draggable?: boolean });
    setPosition(position: LatLng): void;
    setMap(map: Map | null): void;
    getPosition(): LatLng;
  }

  class LatLngBounds {
    constructor();
    extend(latlng: LatLng): void;
  }

  namespace event {
    function addListener(
      target: Map | Marker,
      type: string,
      handler: (mouseEvent?: { latLng: LatLng }) => void,
    ): void;
  }

  namespace services {
    enum Status {
      OK = 'OK',
      ZERO_RESULT = 'ZERO_RESULT',
      ERROR = 'ERROR',
    }

    interface PlaceResult {
      id: string;
      place_name: string;
      address_name: string;
      road_address_name: string;
      x: string;
      y: string;
    }

    interface Pagination {
      totalCount: number;
      hasNextPage: boolean;
      gotoPage(page: number): void;
    }

    class Places {
      keywordSearch(
        keyword: string,
        callback: (result: PlaceResult[], status: Status, pagination: Pagination) => void,
      ): void;
    }

    interface AddressResult {
      address: {
        address_name: string;
        region_1depth_name: string;
        region_2depth_name: string;
        region_3depth_name: string;
      } | null;
      road_address: {
        address_name: string;
      } | null;
    }

    class Geocoder {
      coord2Address(
        lng: number,
        lat: number,
        callback: (result: AddressResult[], status: Status) => void,
      ): void;
    }
  }
}
