import { Suspense } from 'react';
import { HomeDirectory } from '@/components/HomeDirectory';

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-screen text-slate-400 text-sm font-mono">
          Loading deals…
        </div>
      }
    >
      <HomeDirectory />
    </Suspense>
  );
}
