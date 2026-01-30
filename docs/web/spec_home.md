# 홈 스펙

## 개요
- **URL**: `/`
- **설명**: 위치/날씨 정보를 표시하고 코디 이미지를 크게 노출한다.

## 0. 라우팅 전략
- **구조**: `app/home/page.tsx` 또는 `app/page.tsx`
- **페이지 레이어**: `page/home/ui/HomePage.tsx`

## 1. UI/UX 계획
### 구조
- 상단 헤더: 브랜드명 노출
- 날씨 정보 카드: 위치명, 날씨, 최저/최고, 풍랑, 강수확률, 현재 온도
- 날씨 팁 문구: 날씨 상태별 한 줄
- 코디 이미지: 약 60vh 높이의 큰 이미지
- 하단 고정 네비게이션: 홈/옷장/룩/마이

## 2. 데이터 전략
### API 계약(도메인 분리)
- **위치 목록**: `GET /locations`
- **날씨 조회**: `GET /locations/{id}/weather`
  - 응답: `tempCurrent`, `tempMin`, `tempMax`, `windSpeed`, `precipitationProbability`, `skyCode` 등
- **날씨 표시용 문구**: `GET /locations/{id}/weather`의 `display` 필드 사용
  - `sky`, `precipitationType`, `message`
- **코디 이미지/설명**: `POST /recommendations/look`
  - 응답: `recommendation.lookImageUrl`, `recommendation.description`

### SSR/CSR
- SSR에서 기본 데이터 로드
- CSR에서 재검증 가능

## 3. 에러/엣지 케이스
| 케이스 | 조건 | 동작 |
|---|---|---|
| 날씨 조회 실패 | API 오류 | 기본 문구 + 빈 상태 UI |
