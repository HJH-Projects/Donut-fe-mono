# 기능 상태 업데이트 규칙

이 문서는 기능 상태 목록(FEATURE_LIST)을 관리하는 규칙을 정의합니다.

## 원칙
- 상태 변경은 **`dev`에서만** 수행
- 병렬/작업 브랜치에서는 상태 변경 금지

## 권장 타이밍
- 시작: 브랜치 이동 전, `dev`에서 `In Progress`로 변경 후 커밋/푸시
- 검증: `dev` ← `<type>/<description>` PR 생성 시 `Need Verify`
- 완료: `dev` 머지 완료 시 `Complete`
