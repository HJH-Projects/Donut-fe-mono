# PROJECT ABSOLUTE RULES (gemini.md)

> [!IMPORTANT]
> **이 파일의규칙은 절대적이며, 모든 AI와 개발자는 이를 반드시 준수해야 합니다.**
> 작업을 시작하기 전에 아래의 [Context Loading Strategy]를 먼저 확인하고, 필요한 컨텍스트만 선별적으로 로드하십시오.

## 1. Context Loading Strategy (AI 필독)
모든 파일을 무작정 읽지 말고, **현재 요청에 필요한 문서만** 골라서 `read_file` 하십시오.

| 상황 (Context) | 읽어야 할 문서 (Path) | 설명 |
|---|---|---|
| **코드 작성/수정 시** | `apps/web/docs/CODING_CONVENTION.md` | 컴포넌트 구조, Naming, Tailwind 정렬 등 스타일 가이드. |

| **작업 진행 & 브랜치 전략** | `apps/web/docs/WORKFLOW.md` | Feature ID 기반 브랜치, 커밋 메시지, 빌드 검증 절차. |
| **에러 발생/해결 시** | `apps/web/docs/ERROR_LOG.md` | 에러 로그 기록 및 해결 방법 조회 (일관성 유지). |
| **새 기능 명세 작성 시** | `apps/web/docs/SPEC_TEMPLATE.md` | 새로운 엔드포인트(`apps/web/app/[feature]`)의 설계 문서 양식. |
| **전체 기능 현황 파악 시** | `apps/web/docs/FEATURE_LIST.md` | 구현된 기능 목록 및 To-do 확인. |

---

## 2. Tech Stack (Strict)
이 기술 스택 이외의 라이브러리 추가는 사용자의 명시적 허가가 필요합니다.
- **Core**: Next.js (App Router), TypeScript, **ky** (HTTP Client)
- **Scope**: 현재 개발 단계에서는 **`apps/web`** 내부 작업에만 집중. (공통 로직인 `packages/`는 추후 모바일 앱 개발 시점에 분리).
- **Strict Rules**:
  - **1rem = 10px** 준수.
  - **Logic/View Separation**: JSX Return 내부에서 로직 구현 금지.
  - **Page Structure**: `app/`에서는 메타데이터만 처리.
  - **Modular Page Layer**: `page/[domain]/` 폴더 사용.
    - `page/home/ui/`: UI 컴포넌트 위치.
      - **Root**: `*Page.tsx` (예: `HomePage.tsx`)는 전체 조립 담당. 필수 존재.
      - **Sub**: 해당 페이지 전용 컴포넌트(`HomeBanner.tsx` 등) 공존 가능.
    - `page/home/model/`: 로컬 상태/타입 정의.
  - **Naming**: Folder(kebab), File(camel) 준수.

## 3. Architecture & Documentation
- **Structure**: **FSD-Lite** (App / Page / Features / Shared).
  - `app/`: Routing & Metadata only.
  - `page/`: UI Assembly Level (`page/[domain]/ui/*Page.tsx`).
  - **Routing/Structure**:
    - `layout.tsx`, `(route-group)`, `parallel-routes` 등 Next.js 고급 기능 사용 시, **반드시 `SPEC.md`에 먼저 정의**해야 함.
    - `SPEC.md`에 없는 임의의 구조 변경 금지.
  - `features/`: Business logic slices.
  - `shared/ui`: Design System implementation.
  - `shared/api`: HTTP Client (`ky`) instances (Separated into `client.ts` / `server.ts`).
- **Documentation Rule**:
- **Documentation Rule**:
  - **Spec Location**: `apps/web/app/[endpoint]/` 폴더에 `SPEC.md` 필수 작성. (URL 구조와 일치)
  - 구조 상세는 `apps/web/docs/CODING_CONVENTION.md` 참조.

## 4. Mobile Policy
- **Mobile First**: 모든 UI는 모바일 뷰포트 기준으로 우선 설계.
- **Interaction**: 터치 기반의 UX 제공 (Hover보다는 Active 상태 고려).

## 5. AI Protocol
- **Diff Only**: 코드 수정 제안 시 전체 파일이 아닌 변경된 부분만 명확히 제시.
- **Reasoning**: 왜 이 코드를 수정하는지 기술적 근거를 한 줄로 요약할 것.
- **Error Handling**: 에러 해결 시 반드시 `apps/web/docs/ERROR_LOG.md`를 확인하고, 신규 해결책이면 기록할 것.

