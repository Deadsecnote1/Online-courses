/**
 * Coupon ingestion CLI. Mutates this process only.
 * To update a running site, POST /api/sync-coupons with CRON_SECRET or admin key.
 * Usage: npx tsx scripts/scrape-coupons.ts
 */

import { runCouponPipeline } from '../src/lib/couponPipeline';

async function main() {
  console.log('🚀 [COUPON PIPELINE] Starting ingestion + expiration...');
  const summary = await runCouponPipeline();

  console.log('\n✅ [PIPELINE SUMMARY]');
  console.log(`- New coupons ingested: ${summary.newIngested}`);
  console.log(`- Expired coupons suppressed: ${summary.expired_cleaned}`);
  console.log(`- Active catalog size: ${summary.active_courses}`);
  console.log(`- Total catalog size: ${summary.total_courses}`);
  if (summary.added_ids.length) {
    console.log(`- Added IDs: ${summary.added_ids.join(', ')}`);
  }
}

main().catch(console.error);
