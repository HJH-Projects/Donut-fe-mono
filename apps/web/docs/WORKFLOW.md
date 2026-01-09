# Development Workflow

## 1. Feature Lifecycle & Branching
모든 작업은 `FEATURE_LIST.md`의 ID를 기준으로 브랜치를 생성하여 진행합니다.

### Step 1: Pre-Work (In Progress)
1. `apps/web/docs/FEATURE_LIST.md`에서 작업할 항목의 상태를 `🔄 (In Progress)`로 변경.
2. 작업할 경로(`apps/web/page/[domain]/` 등)에 `SPEC.md`가 정의되어 있는지 확인. 없으면 작성.
3. **Commit** (on `dev`): 작업 시작 상태와 스펙을 저장.
   ```bash
   git add .
   git commit -m "docs: start [FEATURE-ID]"
   ```
4. **Branching**:
   ```bash
   git checkout -b feature/[FEATURE-ID]  # e.g., feature/AUTH-1
   ```

### Step 2: Implementation (Dev Loop)
1. **Spec 준수**: 정의된 스펙에 맞춰 코드 구현.
2. **Build & Run (수시 확인)**:
   - 작업 중간중간 빌드 에러 확인.
   - `pnpm dev`로 실제 동작 확인.

### Step 3: Verify & Cleanup
1. **Final Build**: `pnpm build` 성공 확인.
2. **Lint & Prettier**: 코드 포맷팅 및 린트 에러 수정.
3. **Self-Test**: 스펙에 정의된 기능이 정상 동작하는지 최종 확인.

### Step 4: Commit & Finish
1. **Commit**: Conventional Commits (Korean) 사용.
   - `feat(AUTH-1): 로그인 폼 UI 구현`
   - `fix(AUTH-1): 유효성 검사 에러 수정`
2. **Merge**: PR 또는 Merge 후 `dev` 브랜치로 복귀.
3. **Status Update**: `FEATURE_LIST.md` 상태를 `✅ (Complete)`로 변경 (필요 시 `👀 (Need Verify)`).

---

## 2. Commit Convention (Conventional Commits)
- `feat`: 새로운 기능 추가
- `fix`: 버그 수정
- `docs`: 문서 수정
- `style`: 코드 포맷팅, 세미콜론 누락 등 (로직 변경 없음)
- `refactor`: 코드 리팩토링
- `test`: 테스트 코드 추가
- `chore`: 빌드 업무 수정, 패키지 매니저 설정 등

**Format**: `type(scope): descriptions`
- Scope에는 가급적 FEATURE-ID 사용 권장.
