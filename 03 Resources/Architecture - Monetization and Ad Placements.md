# Architecture: Monetization and Ad Placements

#monetization #adsense #affiliate #architecture #rakuten

> **Document Type:** Architecture & Monetization Blueprint  
> **Resource Category:** Revenue Engineering & Ad Unit Placement  
> **Target Partners:** Google AdSense, Rakuten Advertising (Udemy), Secondary Affiliate Platforms (Impact, CJ, Direct)  
> **Platform stack:** [[Architecture - Platform Stack]]  
> **Parent Project:** [[P01 - Free Course Website MVP]]  
> **Revenue Plan (cash model):** [[P02 - Revenue Plan and Unit Economics]]  
> **Pipeline SOP:** [[SOP - Automated Sourcing Pipeline]]  
> **Broadcast Templates:** [[Swipe File - Broadcast Templates]]  
> **Master Index:** [[Vault Overview]]

---

## 1. Monetization Strategy Overview
The platform uses a dual-engine monetization structure designed to extract value from high-volume broadcast traffic (Telegram/WhatsApp) without degrading user trust or site load speed.

```
                    ┌─────────────────────────────────────────┐
                    │          Total Platform Revenue          │
                    └────────────────────┬────────────────────┘
                                         │
                 ┌───────────────────────┴───────────────────────┐
                 ▼                                               ▼
   ┌───────────────────────────┐                   ┌───────────────────────────┐
   │    Affiliate Marketing    │                   │     Display Advertising   │
   │        (~65-75%)          │                   │         (~25-35%)         │
   └─────────────┬─────────────┘                   └─────────────┬─────────────┘
                 │                                               │
    ┌────────────┴────────────┐                     ┌────────────┴────────────┐
    ▼                         ▼                     ▼                         ▼
Udemy Deals          Secondary Tools          In-Feed Cards          Sticky Banners &
(Rakuten Deep Link)  (Hosting, VPN, SaaS)     (AdSense Native)       Leaderboards
```

---

## 2. Google AdSense Container Specifications & Ad Placement Zones

To maximize eCPM while maintaining Core Web Vitals (CLS < 0.1), all ad units are allocated fixed-aspect responsive container wrappers (`min-height` reserved) to prevent layout shifts.

`AD_ZONE_SIDEBAR` is mounted on the homepage at `xl` as a sticky column (`AdBanner type="sidebar"`). Secondary CTAs read:

```env
NEXT_PUBLIC_AFFILIATE_VPS_URL
NEXT_PUBLIC_AFFILIATE_VPN_URL
NEXT_PUBLIC_AFFILIATE_TOOLS_URL
```

If unset, href is `#` (no fake LinkShare root). Display units are still mock containers, not live `adsbygoogle`.

### Ad Unit Map & Technical Specs

| Zone Identifier | Location & Frequency | Target Dimensions | Ad Format | Cumulative Fill Impact |
| :--- | :--- | :--- | :--- | :--- |
| `AD_ZONE_HEADER` | Top below Navbar | `728x90` (Desktop) / `320x50` (Mobile) | Responsive Display Leaderboard | High Viewability |
| `AD_ZONE_INFEED` | Injected every 6th card in Grid | Dynamic Card Dimensions (`350x420`) | Native In-Feed Unit | Maximum Click-Through Rate |
| `AD_ZONE_SIDEBAR` | Right Column Sticky (Desktop) | `300x250` Medium Rectangle / `300x600` | Display Auto-Refresh | High CPM |
| `AD_ZONE_FOOTER_STICKY` | Bottom Fixed Overlay | `320x50` (Mobile) / `728x90` (Desktop) | Sticky Anchor Unit | Maximum Impression Volume |

### React Component Implementation Standard (`src/components/AdBanner.tsx`)
```tsx
import React, { useEffect } from 'react';

interface AdBannerProps {
  slot: string;
  format?: 'auto' | 'fluid' | 'rectangle';
  responsive?: boolean;
  className?: string;
  minHeight?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slot,
  format = 'auto',
  responsive = true,
  className = '',
  minHeight = '90px'
}) => {
  useEffect(() => {
    try {
      // @ts-ignore
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (err) {
      console.error('AdSense load error:', err);
    }
  }, []);

  return (
    <div 
      className={`ad-container my-4 flex flex-col items-center justify-center bg-slate-900/40 rounded-xl border border-slate-800/60 p-2 overflow-hidden ${className}`}
      style={{ minHeight }}
    >
      <span className="text-[10px] uppercase tracking-wider text-slate-500 mb-1 font-mono">
        Advertisement
      </span>
      <ins
        className="adsbygoogle"
        style={{ display: 'block', width: '100%' }}
        data-ad-client="ca-pub-XXXXXXXXXXXXXXXX" // Replace with production Publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive={responsive ? 'true' : 'false'}
      />
    </div>
  );
};
```

---

## 3. Rakuten Affiliate Link Architecture (Udemy Deep Links)

Udemy affiliate links are routed through Rakuten LinkShare deep-link tracking.

### Deep Link Structure
```text
Base Rakuten Gateway: https://click.linksynergy.com/deeplink
Query Parameters:
  - id   = {RAKUTEN_PUBLISHER_TOKEN}   (Unique Publisher ID)
  - mid  = 13884                        (Udemy Merchant ID on Rakuten)
  - murl = {ENCODED_DESTINATION_URL}   (Percent-encoded target URL with coupon code)
  - u1   = {TRACKING_SUBID}             (Optional traffic channel SubID: e.g. telegram_dev)
```

### URL Generator Helper Logic (`src/utils/affiliate.ts`)
```typescript
export function generateUdemyAffiliateUrl(
  udemyUrl: string, 
  subId: string = 'website'
): string {
  const publisherId = process.env.NEXT_PUBLIC_RAKUTEN_PUB_ID || 'DEMO_PUB_ID';
  const merchantId = '13884'; // Udemy Rakuten Merchant ID
  const encodedMurl = encodeURIComponent(udemyUrl);

  return `https://click.linksynergy.com/deeplink?id=${publisherId}&mid=${merchantId}&murl=${encodedMurl}&u1=${subId}`;
}
```

---

## 4. Secondary Contextual Affiliate Widgets

To monetize users who might already own the course or want complementary resources, contextual developer tool widgets are integrated into course detail modals and category sidebars:

### Widget Inventory & Conversion Partners

1. **Cloud Hosting & Infrastructure:**
   - **Vultr / DigitalOcean / Linode:** \$100 Free Credit Referral Banners shown on Web Dev & Cloud DevOps courses.
   - **Conversion Payout:** \$25–\$100 per paid signup.

2. **Cybersecurity & Privacy:**
   - **NordVPN / Surfshark / ExpressVPN:** Cybersecurity & Ethical Hacking course cards feature "Secure Your Lab with 70% OFF VPN".
   - **Conversion Payout:** 40%–100% recurring commission.

3. **Developer Productivity & AI Tools:**
   - **JetBrains / Coursera Plus / GitHub Copilot / Hosting:** Embedded contextual recommendation cards.
   - **Placement:** Positioned below course instructor bio or sidebar widget area.

### Visual Mockup: Contextual Secondary Card
```
┌────────────────────────────────────────────────────────┐
  💡 Dev Tool Recommendation
  Build python apps faster with high performance cloud VPS.
  Get $100 Free Cloud Credits → [ Claim Offer (Affiliate) ]
└────────────────────────────────────────────────────────┘
```
