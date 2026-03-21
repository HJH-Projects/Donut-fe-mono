export function isKakaoTalkWebView(userAgent: string) {
  return /KAKAOTALK/i.test(userAgent);
}

export function buildKakaoExternalUrl(url: string) {
  return `kakaotalk://web/openExternalApp?url=${encodeURIComponent(url)}`;
}
