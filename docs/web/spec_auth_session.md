# 인증 세션/라우팅 스펙

## 개요
- **URL**: `/login`, `/login/callback`, `/`(홈), 보호가 필요한 경로
- **설명**: 쿠키 기반 인증 상태에 따라 라우팅을 제어하고 SSR/CSR에서 동일한 유저 정보를 공유한다.

## 0. 라우팅 전략
- **구조**:
  - `app/login/page.tsx`
  - `app/login/callback/page.tsx`
  - `app/(routes)/layout.tsx` (보호 라우팅이 필요할 경우)
- **페이지 레이어**:
  - `page/login/ui/LoginPage.tsx`
  - `page/login/ui/LoginCallbackPage.tsx`

## 1. 쿠키 기반 라우팅
- **리다이렉트 규칙**:
  - `accessToken` 쿠키가 있으면 `/login` 접근 시 `/`로 리다이렉트
  - `accessToken` 쿠키가 없으면 보호 경로 접근 시 `/login`으로 리다이렉트
- **처리 위치**: `middleware.ts` 또는 각 페이지의 서버 로직

## 2. 유저 정보 SSR/CSR 공유
- **SSR**:
  - 서버에서 `GET /users/me` 호출
  - 응답 성공 시 초기 유저 정보를 페이지에 주입
- **CSR**:
  - 클라이언트에서 동일한 `GET /users/me` 호출
  - SSR에서 주입된 값을 우선 사용하고 필요 시 갱신

## 3. API 계약(최소)
- **유저 정보**:
  - `GET /users/me`
  - 응답: `id`, `nickname`, `profileImg`, `isNewUser`, `createdAt`
- **인증 처리**:
  - `POST /auth/logout` (로그아웃)
  - `GET /auth/refresh` (액세스 토큰 갱신)

## 4. 에러/엣지 케이스
| 케이스 | 조건 | 동작 |
|---|---|---|
| 쿠키 만료 | `accessToken` 없음 | 로그인으로 리다이렉트 |
| 유저 정보 실패 | `/me` 실패 | 게스트 상태로 처리 |
