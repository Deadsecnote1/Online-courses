import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '100% Free Udemy Courses with Coupons | Daily Discount Deals',
  description: 'Discover active 100% discount Udemy coupon codes across Python, Ethical Hacking, AWS, Web Development, UI/UX Design, and Business. Updated every 6 hours.',
  keywords: ['free udemy courses', 'udemy 100 off coupons', 'free python course', 'udemy coupon code 2026', 'ethical hacking free course'],
  openGraph: {
    title: '100% Free Udemy Courses with Coupons',
    description: 'Claim verified $0 Udemy course coupon codes across programming, cybersecurity, design, and business.',
    url: 'https://courses.domain.com',
    siteName: 'Free Course Aggregator',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
