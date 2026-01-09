# Coding Convention & Architecture

## 1. Project Structure (FSD-Lite)
We follow a simplified Feature-Sliced Design (FSD) adapted for Next.js App Router.

### Directory Layout
```
### Directory Layout (Root: `apps/web/`)
```
.
├── app/                  # [App] Layer: Routing, Metadata, SSR Config
│   ├── (routes)/
│   ├── layout.tsx
│   └── login/
│       ├── page.tsx
│       └── SPEC.md       # [Doc] Page Specifications (Located here)
├── page/                 # [Page] Layer: UI Composition
│   ├── home/
│   │   ├── ui/
│   │   │   ├── HomePage.tsx  # [Entry] Root UI Assembly
│   │   │   └── HomeHeader.tsx # [Sub] Local Component
│   │   ├── model/            # Local state/logic if needed
│   │   └── SPEC.md           # [Doc] Page Specifications
│   └── login/
├── features/             # [Features] Layer: Business Logic Slices
│   ├── auth/
│   ├── home/
│   └── profile/
└── shared/               # [Shared] Layer: Reusable across features
    ├── ui/               # Design System
    ├── hooks/
    ├── utils/
    └── api/              # [API] HTTP Client Config
        ├── client.ts     # ky instance for Browser (Toast, Auth Refresh)
        └── server.ts     # ky instance for RSC/Server Actions (Base URL)
```
```

### Rules
- **app/**: Only Metadata & SSR Config. Imports `*Page.tsx` from `page/[domain]/ui/`.
  - **SPEC.md**: Place the specification file here (next to `page.tsx`).
- **page/**: Mirror of App Routing (1-depth).
  - Use `ui/` for components.
    - **Entry Point**: Must be named `*Page.tsx` (e.g., `HomePage.tsx`).
    - **Sub Components**: Allowed in `ui/` if specific to this page (e.g., `HomeHeader.tsx`).
  - Use `model/` for local types/logic.
- **features/**: Contains domain-specific components, hooks, and state.
  - Structure: `features/[feature]/ui`, `features/[feature]/model` (hooks, state), `features/[feature]/api`.
- **shared/**:
  - `shared/ui`: Design System implementation.
  - `shared/hooks`: Generic utility hooks (e.g., `useDebounce`).
  - `shared/utils`: Pure functions.
  - **shared/api**:
    - **Usage**: `import { httpClient } from '@/shared/api/client';`
    - **Tool**: `ky` library.
    - **Separation**:
      - `client.ts`: Used in Components/Hooks. Includes Interceptors (Auth Refresh, Global Error Toast).
      - `server.ts`: Used in RSC/Server Actions. Handles backend Base URL and Cookie propagation.

## 2. Code Style Fundamentals
- **Strict TypeScript**: `noImplicitAny` is mandatory. Avoid `any` type.
- **Naming Convention**:
  - **Data Fetching**:
  - **Client**: `TanStack Query` + `ky` combination (Consistent API).
  - **Server**: `ky` (Server Instance) inside Server Components/Actions.

## 4. Asset Strategy
- **Images**:
  - **Dynamic**: S3/CDN URL 사용 권장 (`next.config.js` remotePatterns 설정).
  - **Static**: UI 아이콘/로고 등 불변 에셋만 `public/` 폴더 사용.
  - **Optimization**: Next.js `<Image />` 컴포넌트 필수 사용.
- **Fonts**:
  - **tool**: `next/font` (Google Fonts) 사용. (자동 Self-hosting & CDN 최적화됨).

  - **Directories (App Router)**: kebab-case (e.g., `my-page/`).
  - **Files**: camelCase (e.g., `userProfile.tsx`, `useAuth.ts`).
  - **Components**: PascalCase (e.g., `UserProfile`).
  - **Hooks**: Must start with `use`.
- **Units**: **1rem = 10px**. (Set `html { font-size: 62.5%; }` in global CSS).

## 3. Component Architecture
- **Separation of Logic & View**:
  - **NO logic in JSX return**. Pass all handlers/values from the component body.
  - **Bad**: `<button onClick={() => { console.log('click'); doSomething(); }}>`
  - **Good**: `<button onClick={handleClick}>`
  
- **App Router (`page.tsx`) Rule**:
  - `page.tsx` must **ONLY** handle:
    - Metadata (`generateMetadata`)
    - Server Side Configuration (Cache, Fetching)
  - **UI Delegation**: Must import the single root component (`*Page.tsx`) from `@/page`.
  - Example:
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

## 4. Tailwind CSS
- **Utility**: Use `clsx` or `tailwind-merge` for conditional classes.
- **No Arbitrary Values**: Avoid `w-[123px]`. Use theme values.
