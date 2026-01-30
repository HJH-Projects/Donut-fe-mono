# 웹 스펙 확장 템플릿

이 문서는 `docs/spec_template.md`의 공통 최소 스펙을 기반으로,
웹(Next.js)에서만 필요한 항목을 추가로 정의합니다.

## 사용 방법
1) 먼저 공통 템플릿(`docs/spec_template.md`)을 복사해 작성합니다.
2) 공통 템플릿의 최소 스펙(라우팅/핵심 UI/주요 API)을 먼저 채웁니다.
3) 아래 항목 중 필요한 것만 추가로 작성합니다.

## A. 라우팅 고급 구조
- Route Group 사용 여부: `(auth)`, `(marketing)` 등
- `layout.tsx` 필요 여부 및 적용 범위
- `metadata` 전략(타이틀/디스크립션)

## B. 렌더링 전략
- SSR/CSR 구분과 이유
- 캐시 전략(예: 기본/재검증/무효화)

## C. 데이터 요청
- 서버 요청: `shared/api/server.ts` 사용 여부
- 클라이언트 요청: `shared/api/client.ts` 사용 여부
- 쿼리 키/캐시 정책(TanStack Query 사용 시)

## D. 에러/엣지 처리
- `error.tsx` 또는 에러 바운더리 필요 여부
- 인증 만료/권한 거부 처리 흐름
