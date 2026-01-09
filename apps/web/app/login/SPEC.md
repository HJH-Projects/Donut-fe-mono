# Auth (Social Login/Kakao) Spec

## Overview
**URL**: `/login`
**Description**: 카카오 소셜 로그인을 통해 사용자를 인증하고 앱 세션을 생성한다.

## 1. UI/UX Plan
### Structure & Layout
- **Centered Layout**: 화면 중앙에 로고(Top-Center)와 로그인 버튼(Center) 배치.
- **Responsive**: 모바일에서는 버튼이 하단에 고정(`fixed-bottom`), 데스크탑에서는 중앙 카드 형태.

### Component Hierarchy
- `LoginPage` (Root)
  - `LoginLogo`
  - `KakaoLoginButton`

## 2. Data Strategy
### Server-Side (SSR)
- **Redirect Check**: `page.tsx` 또는 `middleware`
  - **Condition**: 쿠키에 유효한 `accessToken` 존재 시.
  - **Action**: `/` (메인)으로 즉시 리다이렉트. 렌더링 불필요.

### Client-Side (Interaction)
- **Scenario**: 카카오 인증 후 Callback 처리.
- **Endpoint**: `POST /api/auth/kakao`
  - Body: `{ code: "kakao_auth_code" }`
- **State Management**:
  - **Tool**: `clientKy.post(...)` (Custom Hook 내부에서 호출).
  - **Loading**: 버튼 내부 스피너(`Spinner`) 또는 전체 화면 오버레이 사용.

## 3. Client Flow & Logic
1. 사용자 '카카오 로그인' 버튼 클릭 -> `kauth.kakao.com` 이동.
2. 인증 완료 후 `/login/callback?code={CODE}`로 복귀.
3. `useEffect`에서 `code` 파싱.
4. `code`가 유효하면 백엔드 `POST /api/auth/kakao` 요청.
5. **성공 시**:
   - 응답의 `accessToken`을 쿠키/스토리지에 저장.
   - 유저 프로필 정보를 Global Store(`useUserStore`)에 업데이트.
   - `/` 메인으로 이동.

## 4. Edge Cases & Error Handling
| Case | Condition | Behavior/UI (Fallback) |
|------|-----------|------------------------|
| **User Cancel** | 유저가 카카오 동의 화면에서 취소 | 로그인 페이지 유지 (아무 동작 없음) |
| **Network Error** | 백엔드 통신 실패 (500) | "로그인 서버 응답 없음" 토스트 노출 |
| **Invalid Code** | 코드가 만료되었거나 조작됨 (400) | "인증에 실패했습니다. 다시 시도해주세요" 알림 후 홈 리다이렉트 |
| **Already User** | 이미 가입된 이메일 | 별도 절차 없이 자동 로그인(Merge) 처리 |
