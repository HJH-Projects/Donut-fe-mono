export function isKakaoTalkWebView(userAgent: string) {
  return /KAKAOTALK/i.test(userAgent);
}

export function buildKakaoExternalUrl(url: string) {
  return `kakaotalk://web/openExternal?url=${encodeURIComponent(url)}`;
}
