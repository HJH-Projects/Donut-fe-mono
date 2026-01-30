# 코딩 컨벤션 & 아키텍처

## 0. 기술 스택 & 범위(웹)
- **핵심**: Next.js (App Router), TypeScript, **ky** (HTTP 클라이언트)
- **Scope**: 현재 개발 단계에서는 **`apps/web`** 내부 작업에만 집중
- **엄격 규칙**:
  - **1rem = 10px** 준수
  - **Logic/View Separation**: JSX Return 내부에서 로직 구현 금지
  - **페이지 구조**: `app/`에서는 메타데이터만 처리
  - **Modular Page Layer**: `page/[domain]/` 폴더 사용
    - **루트**: `*Page.tsx`는 전체 조립 담당 (필수 존재)
    - **서브**: 페이지 전용 컴포넌트 공존 가능
  - **Naming**: Folder(kebab), File(camel) 준수

## 1. 프로젝트 구조 (FSD-Lite)
Next.js App Router에 맞춘 간소화된 FSD 구조를 사용한다.

### 디렉터리 구조
```
### 디렉터리 구조 (루트: `apps/web/`)
```
.
├── app/                  # [App] 레이어: 라우팅/메타데이터/SSR 설정
│   ├── (routes)/
│   ├── layout.tsx
│   └── login/
│       └── page.tsx
├── page/                 # [Page] 레이어: UI 조립
│   ├── home/
│   │   ├── ui/
│   │   │   ├── HomePage.tsx  # [엔트리] 루트 UI 조립
│   │   │   └── HomeHeader.tsx # [서브] 로컬 컴포넌트
│   │   ├── model/            # 로컬 상태/로직(필요 시)
│   └── login/
├── features/             # [Features] 레이어: 비즈니스 로직
│   ├── auth/
│   ├── home/
│   └── profile/
└── shared/               # [Shared] 레이어: 공용 모듈
    ├── ui/               # 디자인 시스템
    ├── hooks/
    ├── utils/
    └── api/              # [API] HTTP 클라이언트 설정
        ├── client.ts     # 브라우저용 ky 인스턴스(토스트/리프레시)
        └── server.ts     # RSC/서버 액션용 ky 인스턴스(기본 URL)
```
```

### 규칙
- **app/**: 메타데이터/SSR 설정만 담당. `page/[domain]/ui/*Page.tsx`를 import.
  - **스펙**: `docs/web/spec_<endpoint>.md`에 작성한다.
- **page/**: 라우팅과 1-depth 매칭.
  - 컴포넌트는 `ui/`에 위치.
    - **엔트리**: `*Page.tsx` (예: `HomePage.tsx`) 필수.
    - **서브**: 페이지 전용 컴포넌트는 `ui/`에 배치 (예: `HomeHeader.tsx`).
  - 로컬 타입/로직은 `model/` 사용.
- **features/**: 도메인별 컴포넌트/훅/상태.
  - 구조: `features/[feature]/ui`, `features/[feature]/model`, `features/[feature]/api`.
- **shared/**:
  - `shared/ui`: 디자인 시스템 구현.
  - `shared/hooks`: 공용 유틸 훅.
  - `shared/utils`: 순수 함수.
- **shared/api**:
    - **사용**: `import { httpClient } from '@/shared/api/client';`
    - **도구**: `ky`
    - **분리**:
      - `client.ts`: 컴포넌트/훅에서 사용. 인터셉터 포함(리프레시/토스트).
      - `server.ts`: RSC/서버 액션에서 사용. 기본 URL/쿠키 처리.

## 1.1 문서 규칙(웹)
- `docs/web/spec_<endpoint>.md`에 스펙을 작성한다. (URL 구조와 일치)
- `layout.tsx`, `(route-group)`, `parallel-routes` 등 구조 변경은 스펙에 먼저 정의한다.

## 2. 코드 스타일 기본
- **엄격한 TypeScript**: `noImplicitAny` 필수, `any` 금지.
- **데이터 패칭**:
  - **클라이언트**: `TanStack Query` + `ky`
  - **서버**: 서버 컴포넌트/액션에서 `ky` 사용

## 3. 에셋 전략
- **Images**:
  - **Dynamic**: S3/CDN URL 사용 권장 (`next.config.js` remotePatterns 설정).
  - **Static**: UI 아이콘/로고 등 불변 에셋만 `public/` 폴더 사용.
  - **Optimization**: Next.js `<Image />` 컴포넌트 필수 사용.
- **Fonts**:
  - **tool**: `next/font` 사용. (자동 Self-hosting & CDN 최적화)

- **Directories (App Router)**: kebab-case (예: `my-page/`).
- **Files**: camelCase (예: `userProfile.tsx`, `useAuth.ts`).
- **Components**: PascalCase (예: `UserProfile`).
- **Hooks**: `use`로 시작.
- **Units**: **1rem = 10px**. (Set `html { font-size: 62.5%; }` in global CSS).

## 4. 컴포넌트 아키텍처
- **로직/뷰 분리**:
  - JSX return 내부 로직 금지. 핸들러/값은 컴포넌트 본문에서 전달.
  - **Bad**: `<button onClick={() => { console.log('click'); doSomething(); }}>`
  - **Good**: `<button onClick={handleClick}>`
  
- **App Router (`page.tsx`) 규칙**:
  - `page.tsx`는 아래만 처리:
    - Metadata (`generateMetadata`)
    - 서버 설정(Cache/Fetch)
  - **UI 위임**: `@/page`의 `*Page.tsx`만 import
  - 예시:
    ```tsx
    // app/home/page.tsx
    import { HomePage } from '@/page/home/ui/HomePage';
    
    export const metadata = { ... };
    
    export default function Page() {
      return <HomePage />;
    }
    ```
    
    ```tsx
    // page/home/ui/HomePage.tsx
    import { UserProfile } from '@/features/user';
    import { HomeHeader } from './HomeHeader'; // Local sub-component
    
    export const HomePage = () => {
      return (
        <main>
          <HomeHeader />
          <UserProfile />
        </main>
      );
    };
    ```

## 5. Tailwind CSS
- **유틸**: 조건부 클래스는 `clsx` 또는 `tailwind-merge`.
- **임의 값 금지**: `w-[123px]` 금지, 테마 값 사용.
