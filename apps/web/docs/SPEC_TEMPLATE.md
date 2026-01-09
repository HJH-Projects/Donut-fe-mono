# [Endpoint/Feature Name] Spec

## Overview
**URL**: `/example/path`
**Description**: 해당 기능/페이지의 목적과 역할을 요약합니다.

## 0. Routing Strategy (Advanced)
> `layout.tsx`, `(group)`, `metadata` 계획을 여기서 먼저 수립합니다.
- **File Structure**:
  - `app/[feature]/layout.tsx`: (e.g., 로그인 전용 헤더가 필요한가?)
  - `app/(auth)/login/page.tsx`: (Route Group 사용 여부)
- **Metadata**:
  - `title`: "Donut - {PageName}"
  - `description`: "..."

## 1. UI/UX Plan
### Structure & Layout
- **Composition**: 화면 구성 요소 (e.g., Header + Main Content + Bottom Button).
- **Responsive**: 모바일 vs 데스크탑 레이아웃 차이점 명시.

### Component Hierarchy
- `MainComponent`
  - `SubComponentA`
  - `SubComponentB`

## 2. Data Strategy (Detailed)
### Server-Side (SSR)
- **Primary Data**: `GET /api/v1/banners` (Main Banner)
  - **Method**: `serverKy.get('banners').json()`
  - **Cache Strategy**: Next.js Default (deduped).
- **Secondary Data**: `GET /api/v1/user/profile`
  - **Condition**: `Authorization` 쿠키 존재 시에만 요청.
  - **Fallback**: 비로그인 상태 UI 렌더링.

### Client-Side (Interaction)
- **Scenario**: "더보기" 버튼 클릭 시 상품 추가 로드.
- **Endpoint**: `GET /api/v1/products?page={n}`
- **State Management**:
  - **Library**: TanStack Query (`useInfiniteQuery`)
  - **Fetcher**: `() => clientKy.get('products', { searchParams: { page } }).json()`
  - **Query Key**: `['products', categoryId]`
  - **Stale Time**: 5분 (잦은 갱신 불필요).

## 3. Client Flow & Logic
1. 사용자 진입 -> SSR로 초기 데이터 로드 (Banner, First Page Products).
2. `Action Button` 클릭 -> 클라이언트 유효성 검사 (길이, 형식 등).
3. API 요청 -> `isLoading` 상태 (Skeleton UI 노출).
4. 성공 시 -> `Success Toast` 노출 및 데이터 갱신.
5. 실패 시 -> `onError` 핸들러에서 에러 메시지 파싱 후 Alert 노출.

## 4. Edge Cases & Error Handling
| Case | Condition | Behavior/UI (Fallback) |
|------|-----------|------------------------|
| **API Failure** | 500/Timeout | "일시적인 오류입니다" 전면 에러 컴포넌트 (`error.tsx`) |
| **Empty Data** | 리스트 0개 | "등록된 상품이 없습니다" 아이콘 컴포넌트 |
| **Auth Expired** | 401 Unauthorized | 토큰 갱신 시도 -> 실패 시 로그인 모달 팝업 |
| **Validation** | 입력값 오류 | Input 필드 테두리 빨간색 + 하단 에러 텍스트 |
