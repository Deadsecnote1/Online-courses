import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[#0b0f19] text-slate-100 px-4">
      <h1 className="text-2xl font-extrabold">Page not found</h1>
      <p className="text-sm text-slate-400">That route does not exist on this site.</p>
      <Link href="/" className="px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold">
        Back to Free Courses
      </Link>
    </div>
  );
}
