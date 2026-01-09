# Auth (Social Login) Spec

## Overview
**URL**: `/login`
**Description**: 카카오, 구글, 애플 소셜 로그인을 제공하여 사용자를 인증한다. (애플은 UI만 선구현).

## 0. Routing Strategy
- **Structure**: `app/login/page.tsx`
- **Metadata**:
  - `title`: "로그인 | Donut"
  - `description`: "Donut 옷장과 함께하는 스마트한 패션 생활"

## 1. UI/UX Plan
### Structure & Layout
- **Centered Layout**:
  - **Logo**: 상단 중앙 Donut 로고.
  - **Social Buttons**: 수직 스택 (Vertical Stack).
    - 1. 카카오 (노랑)
    - 2. 구글 (흰색/회색)
    - 3. 애플 (검정) - *Click Event 없이 UI만 노출*
- **Responsive**:
  - **Mobile**: 버튼들이 하단 `SafeArea` 위에 고정(`fixed bottom-0`).
  - **Desktop**: 화면 중앙 카드 UI 내부 배치.

### Component Hierarchy
- `LoginPage`
  - `LoginLogo`
  - `SocialLoginList`
    - `KakaoLoginButton`
    - `GoogleLoginButton`
    - `AppleLoginButton` (Disabled for now)

## 2. Data Strategy
### Server-Side (SSR)
- **Redirect Check**: `middleware.ts` 또는 `page.tsx`
  - **Condition**: 쿠키에 `accessToken` 존재 시 `/`로 리다이렉트.

### Client-Side (Interaction)
- **Logics**:
  - **Kakao**: `GET https://kauth.kakao.com/...` (Redirect)
  - **Google**: `GET https://accounts.google.com/...` (Redirect)
  - **Apple**: *Action 없음 (Pending)*
- **Validation**: 백엔드가 `httpOnly` 쿠키로 세팅해주므로 프론트는 토큰 핸들링 로직 없음.
- **Session Sync**:
  - 로그인 성공 후 메인 페이지 진입 시 `GET /api/user/me` (Global Store 업데이트) *[AUTH-3에서 구현]*

## 3. Client Flow & Logic (Popup Window)
1. **Trigger**: 유저가 '소셜 로그인' 버튼 클릭.
2. **Action**: `window.open`으로 백엔드 인증 URL 호출. 메인 창은 "로그인 중..." 상태로 대기.
3. **Popup Process**:
   - 구글 인증 완료 -> 백엔드 callback (`/auth/google/callback`) 도달.
   - **백엔드 역할**: 해당 URL에서 유저 정보를 응답(JSON/HTML)하며, **Script**를 통해 `window.opener.postMessage` 전송 후 `window.close()` 실행.
     - *Success Message*: `{ type: 'LOGIN_SUCCESS', user: { ... } }`
     - *Fail Message*: `{ type: 'LOGIN_FAIL', error: '...' }`
4. **Main Window Sync**:
   - `window.addEventListener('message', ...)`로 팝업 메시지 수신.
   - **Success**: "로그인 성공!" 텍스트/토스트 노출 -> 메인 리다이렉트.
   - **Fail**: "로그인 실패. 다시 시도해주세요" 텍스트/토스트 노출 -> 대기 상태 복귀.
   - **Popup Closed**: (Optional) 팝업이 메시지 없이 닫힌 경우(interval 체크) -> 대기 상태 복귀.

## 4. Edge Cases & Error Handling
| Case | Condition | Behavior/UI |
|------|-----------|-------------|
| **Popup Blocked** | 브라우저 팝업 차단 | "팝업을 허용해주세요" 토스트 알림. |
| **Manual Close** | 유저가 팝업을 그냥 닫음 | 아무 일도 일어나지 않음 (로그인 미완료). |
| **Login Fail** | 백엔드 인증 실패 | 팝업 내에 "실패했습니다" 텍스트 노출. 메인 창은 대기. |

