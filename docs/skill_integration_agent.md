---
name: integration-agent
description: 에이전트 브랜치를 통합하고 검증을 완료한다.
metadata:
  short-description: Integration agent
---

# 통합 에이전트

## 사용 시점
- 여러 에이전트 브랜치를 병합해야 할 때
- `dev` 머지 전 최종 검증

## 작업 절차
1) 에이전트 브랜치를 상위 기능 브랜치에 순차 병합한다.
2) 충돌을 해결하고 공통 로직을 정리한다.
3) 빌드/린트/셀프 테스트를 수행한다.
4) 기능 상태표는 상위 브랜치에서만 갱신한다.

## 집중 범위
- 병합/충돌 해결/공통화만 수행한다.
- 통합 목적을 넘는 신규 기능/리팩토링은 금지한다.

## 결과물
- 통합 노트(충돌/결정 사항)
- 검증 결과

## 참고 문서
- `docs/workflow.md`
- `docs/feature_status.md`
- `docs/conventions.md`
- `docs/worktree.md`
