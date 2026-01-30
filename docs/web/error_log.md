# Error Log & Solutions

이 문서는 개발 중 발생한 에러와 그 해결 방법을 기록하여, 추후 동일한 문제 발생 시 일관성 있는 처리를 돕기 위해 작성합니다.

## Log Format
- **Date**: YYYY-MM-DD
- **Error Code/Message**: 에러 메시지 원문
- **Context**: 발생 상황 (어떤 작업 중이었는지)
- **Cause**: 원인 분석
- **Solution**: 해결 방법 (코드 수정 내용, 설정 변경 등)
- **Reference**: 참고 링크 (StackOverflow, Github Issue 등)

---

## Logs

### [예시] 2025-01-01: Hydration failed because the initial UI does not match
- **Error**: `Hydration failed because the initial UI does not match what was rendered on the server.`
- **Context**: `AccessTime` 컴포넌트에서 `new Date()`를 렌더링할 때 발생.
- **Cause**: 서버 시간과 클라이언트 시간이 달라 렌더링 결과 불일치.
- **Solution**: `useEffect`를 사용하여 마운트 된 후(`isMounted`)에 시간을 렌더링하도록 수정.
- **Reference**: https://nextjs.org/docs/messages/react-hydration-error
