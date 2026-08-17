/**
 * Automated Coupon Ingestion & Expiration Pipeline Script
 * Usage: npx tsx scripts/scrape-coupons.ts
 */

import { INITIAL_COURSES } from '../src/data/mockCourses';
import { generateUdemyAffiliateUrl } from '../src/utils/affiliate';

interface FeedCoupon {
  title: string;
  category: string;
  instructor: string;
  udemy_url: string;
  coupon_code: string;
  original_price: number;
  rating: number;
}

async function runPipeline() {
  console.log('🚀 [COUPON PIPELINE] Starting 100% Free Udemy Coupon Ingestion...');
  console.log(`[INFO] Current timestamp: ${new Date().toISOString()}`);

  // Mock candidates from RSS/JSON feeds
  const fetchedFeeds: FeedCoupon[] = [
    {
      title: 'Rust Programming & WebAssembly Systems Engineering 2026',
      category: 'Development',
      instructor: 'Jon Gjengset',
      udemy_url: 'https://www.udemy.com/course/rust-systems-programming/',
      coupon_code: 'FREERUST2026',
      original_price: 119.99,
      rating: 4.9,
    },
    {
      title: 'Docker & Kubernetes Hands-On Microservices Masterclass',
      category: 'IT & Security',
      instructor: 'Bret Fisher',
      udemy_url: 'https://www.udemy.com/course/docker-kubernetes-bootcamp/',
      coupon_code: 'FREEDOCKER2026',
      original_price: 129.99,
      rating: 4.8,
    },
  ];

  let newIngested = 0;
  fetchedFeeds.forEach((feed) => {
    const exists = INITIAL_COURSES.some((c) => c.coupon_code === feed.coupon_code);
    if (!exists) {
      newIngested++;
      const destination_url = generateUdemyAffiliateUrl(feed.udemy_url, feed.coupon_code, 'cron_sync');
      
      console.log(`[NEW COUPON] Adding: ${feed.title} | Code: ${feed.coupon_code}`);
      console.log(`[AFFILIATE LINK] ${destination_url}`);
    }
  });

  // Check TTL Expiration (> 48h)
  const now = Date.now();
  let expiredCleaned = 0;
  INITIAL_COURSES.forEach((course) => {
    if (new Date(course.expires_at).getTime() <= now || course.report_count >= 3) {
      if (!course.is_expired) {
        course.is_expired = true;
        expiredCleaned++;
        console.log(`[EXPIRED] Marked inactive: ${course.title}`);
      }
    }
  });

  console.log('\n✅ [PIPELINE SUMMARY]');
  console.log(`- Total Feeds Checked: ${fetchedFeeds.length}`);
  console.log(`- New Coupons Ingested: ${newIngested}`);
  console.log(`- Expired Coupons Suppressed: ${expiredCleaned}`);
  console.log(`- Active Catalog Size: ${INITIAL_COURSES.filter(c => !c.is_expired).length}`);
}

runPipeline().catch(console.error);
