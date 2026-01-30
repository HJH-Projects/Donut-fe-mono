# 룩 상세 스펙

## 개요
- **URL**: `/look/[id]`
- **설명**: 룩에 포함된 옷 이미지들을 2열로 보여준다.

## 0. 라우팅 전략
- **구조**: `app/look/[id]/page.tsx`
- **페이지 레이어**: `page/look/ui/LookDetailPage.tsx`

## 1. UI/UX 계획
### 구조
- 2열 정사각형 이미지 그리드

## 2. 데이터 전략
### API 계약(도메인 분리)
- **룩 상세**: `GET /looks/{id}`
- **룩 수정**: `PATCH /looks/{id}`
- **룩 삭제**: `DELETE /looks/{id}`
- **공유 링크 생성**: `POST /shares`

## 3. 에러/엣지 케이스
| 케이스 | 조건 | 동작 |
|---|---|---|
| 상세 조회 실패 | API 오류 | 에러 UI |
