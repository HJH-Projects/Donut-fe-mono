# 문서 로딩 기준 (컨텍스트 최소화)

## 원칙
- 필요한 문서만 읽는다.
- 공통 문서 → 앱 전용 문서 순으로 최소 범위만 확인한다.
- 역할별 작업은 해당 역할 문서만 추가로 읽는다.

## 필수(모든 작업)
- `docs/README.md`
- `docs/workflow.md`
- `docs/conventions.md`

## 상황별(필요 시에만)
- **병렬 작업**: `docs/worktree.md`
- **기능 상태 업데이트**: `docs/feature_status.md`
- **스펙 작성**: `docs/spec_template.md` + 앱 확장 템플릿
- **아키텍처 확인**: `docs/architecture.md`
- **에러 해결 기록**: `docs/<app>/error_log.md`
- **앱 전용 규칙**: `docs/<app>/coding_convention.md`
- **기능 현황 확인**: `docs/feature_list.md` + 앱별 `docs/<app>/feature_list.md`

## 역할별(해당 역할만)
- 설계/플랜: `docs/skill_design_planner.md`
- 구현: `docs/skill_implementation_agent.md`
- 검수: `docs/skill_review_agent.md`
- 통합: `docs/skill_integration_agent.md`
