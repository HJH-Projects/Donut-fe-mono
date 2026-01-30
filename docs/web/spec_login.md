# 인증(소셜 로그인) 스펙

## 개요
**URL**: `/login`
**설명**: 카카오, 구글, 애플 소셜 로그인을 제공하여 사용자를 인증한다. (애플은 UI만 선구현).

## 0. 라우팅 전략
- **구조**:
  - `app/login/page.tsx`
  - `app/login/callback/page.tsx`
- **페이지 레이어**:
  - `page/login/ui/LoginPage.tsx`
  - `page/login/ui/LoginCallbackPage.tsx`
- **메타데이터**:
  - `title`: "로그인 | Donut"
  - `description`: "Donut 옷장과 함께하는 스마트한 패션 생활"

## 1. UI/UX 계획
### 구조 & 레이아웃
- **중앙 정렬 레이아웃**:
  - **로고**: 상단 중앙 Donut 로고.
  - **소셜 버튼**: 수직 스택.
    - 1. 카카오 (노랑)
    - 2. 구글 (흰색/회색)
    - 3. 애플 (검정) - *Click Event 없이 UI만 노출*
- **반응형**:
  - **모바일**: 버튼들이 하단 `SafeArea` 위에 고정(`fixed bottom-0`).
  - **데스크톱**: 화면 중앙 카드 UI 내부 배치.

### 컴포넌트 계층
- `LoginPage`
  - `LoginLogo`
  - `SocialLoginList`
    - `KakaoLoginButton`
    - `GoogleLoginButton`
    - `AppleLoginButton` (Disabled for now)

## 2. 데이터 전략
### API 계약(최소)
- **인증 진입**:
  - `GET /auth/kakao` (리다이렉트)
  - `GET /auth/google` (리다이렉트)
  - `GET /auth/apple` (UI만, 액션 없음)
- **콜백**:
  - `GET /login/callback?status=success|fail`

### 서버 사이드(SSR)
- **리다이렉트 체크**: `middleware.ts` 또는 `page.tsx`
  - **조건**: 쿠키에 `accessToken` 존재 시 `/`로 리다이렉트.

### 클라이언트 사이드(인터랙션)
- **로직**:
  - **Kakao**: `GET https://kauth.kakao.com/...` (리다이렉트)
  - **Google**: `GET https://accounts.google.com/...` (리다이렉트)
  - **Apple**: *액션 없음 (Pending)*
- **검증**: 백엔드가 `httpOnly` 쿠키로 세팅해주므로 프론트는 토큰 핸들링 로직 없음.
- **세션 동기화**:
  - 로그인 성공 후 메인 페이지 진입 시 `GET /api/user/me` (Global Store 업데이트) *[AUTH-3에서 구현]*

## 3. 클라이언트 흐름 & 로직(팝업)
1. **트리거**: 유저가 '소셜 로그인' 버튼 클릭.
2. **액션**: `window.open`으로 백엔드 인증 URL 호출. (`/auth/google`)
3. **팝업 처리**:
   - 구글 인증 완료 -> 백엔드 로직 수행 (쿠키 세팅).
   - **백엔드 리다이렉트**: 백엔드는 JSON을 응답하지 않고, 프론트엔드 콜백 페이지로 리다이렉트.
     - URL: `http://localhost:3000/login/callback?status=success`
4. **프론트 콜백 페이지 (`/login/callback`)**:
   - **UI**: "로그인 처리 중입니다..." (스피너).
   - **로직**:
     - `useEffect`에서 `status` 파싱.
     - `window.opener.postMessage({ type: 'LOGIN_SUCCESS' }, '*')` 전송.
     - `window.close()` 실행.
5. **메인 창 동기화**:
   - `message` 이벤트 수신 -> 메인 유저 정보 갱신 및 리다이렉트.

## 4. 엣지 케이스 & 에러 처리
| 케이스 | 조건 | 동작/UI |
|------|-----------|-------------|
| **팝업 차단** | 브라우저 팝업 차단 | "팝업을 허용해주세요" 토스트 알림. |
| **수동 종료** | 유저가 팝업을 그냥 닫음 | 아무 일도 일어나지 않음 (로그인 미완료). |
| **로그인 실패** | 백엔드 인증 실패 | 팝업 내에 "실패했습니다" 텍스트 노출. 메인 창은 대기. |
