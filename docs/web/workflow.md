# 웹 워크플로우

공통 워크플로우는 `docs/workflow.md`를 따릅니다.
브랜치/PR 규칙은 `docs/conventions.md` 기준입니다.

## 1. 기능 진행 흐름
모든 작업은 `docs/web/feature_list.md`의 ID를 참고합니다.

### 1) 작업 준비
1. `dev`에서 `docs/web/feature_list.md` 상태를 `🔄 (In Progress)`로 변경 후 커밋/푸시.
2. 작업할 경로에 대응하는 스펙(`docs/web/spec_<endpoint>.md`)이 있는지 확인. 없으면 작성.
   - **스펙 작성 방식**: 먼저 *최소 스펙*을 작성한 뒤 구현하고, 완료 후 스펙을 보강한다.
   - **최소 스펙 범위**: 라우팅 구조, 핵심 UI 구조, 주요 API 계약.
   - **보강 범위**: 에러/엣지 케이스, 상호작용 시퀀스, 상세 데이터 전략.
3. **Commit** (on `dev`): 작업 시작 상태와 스펙을 저장.
   ```bash
   git add .
   git commit -m "docs: start [FEATURE-ID]"
   ```
4. **브랜치 생성**:
   ```bash
   git checkout -b <type>/<description>  # e.g., feat/auth
   ```

### 2) 구현
1. **스펙 준수**: 정의된 스펙에 맞춰 코드 구현.
2. **Build & Run (수시 확인)**:
   - 작업 중간중간 빌드 에러 확인.
   - `pnpm dev`로 실제 동작 확인.

### 3) 검증
1. **Final Build**: `pnpm build` 성공 확인.
2. **Lint & Prettier**: 코드 포맷팅 및 린트 에러 수정.
3. **Self-Test**: 스펙에 정의된 기능이 정상 동작하는지 최종 확인.

### 4) 마무리
1. **Commit**: Conventional Commits (Korean) 사용.
   - `feat(AUTH-1): 로그인 폼 UI 구현`
   - `fix(AUTH-1): 유효성 검사 에러 수정`
2. **PR**: `type/description` 1뎁스 브랜치로 PR 생성 (에이전트 브랜치 사용 시).
3. **Merge**: PR 또는 Merge 후 `dev` 브랜치로 복귀.
4. **상태 업데이트**: `dev`에서만 상태를 변경한다.
