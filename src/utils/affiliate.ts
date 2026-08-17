/**
 * Utility functions for affiliate link generation and tracking parameters
 */

export function generateUdemyAffiliateUrl(
  udemyUrl: string,
  couponCode?: string,
  subId: string = 'website'
): string {
  const publisherId = process.env.NEXT_PUBLIC_RAKUTEN_PUB_ID || '13884_PUBLIC_TOKEN';
  const merchantId = '13884'; // Udemy Merchant ID on Rakuten Advertising

  let targetUrl = udemyUrl;

  // Append coupon code if provided and missing
  if (couponCode && !targetUrl.toLowerCase().includes('couponcode=')) {
    const separator = targetUrl.includes('?') ? '&' : '?';
    targetUrl = `${targetUrl}${separator}couponCode=${encodeURIComponent(couponCode)}`;
  }

  // Percent-encode target URL for Rakuten murl parameter
  const encodedMurl = encodeURIComponent(targetUrl);

  return `https://click.linksynergy.com/deeplink?id=${publisherId}&mid=${merchantId}&murl=${encodedMurl}&u1=${encodeURIComponent(subId)}`;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function formatTimeRemaining(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - new Date().getTime();
  if (diff <= 0) return 'Expired';

  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (hours > 24) {
    const days = Math.floor(hours / 24);
    return `${days}d ${hours % 24}h left`;
  }

  return `${hours}h ${minutes}m left`;
}
