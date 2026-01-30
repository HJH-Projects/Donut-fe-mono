# 공통 컨벤션

이 문서는 모노레포 공통 규칙을 정의합니다.
앱 전용 규칙은 각 앱의 `docs/`에 작성합니다.

## 문서 규칙
- 공통 규칙은 루트 `docs/`에 작성
- 앱 전용 규칙은 `apps/<app>/docs/`에 작성
- 문서에는 명시적인 파일 경로를 적어 혼동을 줄임

## 문서 탐색 규칙
- 코드 작성/수정: `docs/<app>/coding_convention.md`
- 작업 진행/브랜치 전략: `docs/workflow.md`
- 에러 해결: `docs/<app>/error_log.md`
- 스펙 작성: `docs/spec_template.md` + 앱 확장 템플릿
- 기능 현황: `docs/feature_list.md` + 앱별 `docs/<app>/feature_list.md`

## UX 기본 원칙
- 모바일 퍼스트 기준으로 설계한다.
- 터치 기반 인터랙션을 우선한다. (Hover 의존 최소화)

## 브랜치/커밋
- 브랜치: `<type>/<description>` (예: `feat/auth`, `fix/login-error`)
- 커밋 메시지: Conventional Commits 사용
- Scope에는 FEATURE-ID를 권장

## 브랜치 단위 규칙(명확한 정의)
- **도메인/에픽 브랜치**: `feat/<domain>` 형태를 기본 단위로 사용한다. (예: `feat/auth`, `feat/design-system`)
- **포함 범위**: 로그인/인증 등 **동일 도메인**의 관련 변경은 하나의 도메인 브랜치에 모은다.
- **병렬 작업**: 원격에는 도메인 브랜치만 유지하고, 병렬 작업은 로컬 하위 브랜치로만 분리한다.

## 에이전트 프로토콜
- 코드 수정 제안은 변경된 부분만 명확히 제시한다.
- 수정 이유는 기술적 근거를 한 줄로 요약한다.
 - 에러 해결 시 `docs/<app>/error_log.md`를 확인하고, 신규 해결책이면 기록한다.
- 에러 로그는 세션 간 공유 문서로 취급한다.
