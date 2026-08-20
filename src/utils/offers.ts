export type SecondaryOfferKind = 'vpn' | 'vps' | 'tools';

export function getSecondaryOfferUrl(kind: SecondaryOfferKind): string {
  const envMap: Record<SecondaryOfferKind, string | undefined> = {
    vps: process.env.NEXT_PUBLIC_AFFILIATE_VPS_URL,
    vpn: process.env.NEXT_PUBLIC_AFFILIATE_VPN_URL,
    tools: process.env.NEXT_PUBLIC_AFFILIATE_TOOLS_URL,
  };

  const url = envMap[kind];
  if (url && url.startsWith('http')) return url;
  return '#';
}

export function getPublicSiteOrigin(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, '');
  }
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return 'http://localhost:3000';
}
