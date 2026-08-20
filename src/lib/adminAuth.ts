export function getAdminSecret(): string {
  return process.env.ADMIN_SECRET_KEY || 'admin123';
}

export function getCronSecret(): string {
  return process.env.CRON_SECRET || 'demo-cron-secret';
}

export function bearerToken(request: Request): string | null {
  const header = request.headers.get('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  return header.slice('Bearer '.length);
}

export function isAdminAuthorized(request: Request): boolean {
  return bearerToken(request) === getAdminSecret();
}

export function isSyncAuthorized(request: Request): boolean {
  const token = bearerToken(request);
  if (!token) return false;
  return token === getCronSecret() || token === getAdminSecret();
}
