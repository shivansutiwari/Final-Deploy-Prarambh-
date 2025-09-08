
import { Suspense } from 'react';
import { HomePage } from '@/components/landing/home-page';
import { Toaster } from "@/components/ui/toaster";
import { Skeleton } from "@/components/ui/skeleton";

// Default content for static generation
const defaultContent = {
  homepage: {},
  slogans: {slogans: []},
  schedule: { items: [] },
  guests: { guests: [] },
  sponsors: { sponsors: [] },
  highlights: { highlights: [] },
  settings: {},
  gallery: {},
  socials: {},
  organizers: { names: [] },
  contributors: { names: [] },
  sections: {}
};

// Loading component to show during initial load
function HomePageLoading() {
  return (
    <div className="flex flex-col min-h-dvh bg-background space-y-8 p-4">
      <div className="h-20 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-full">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-full max-w-md mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-40 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <Suspense fallback={<HomePageLoading />}>
        <HomePage content={defaultContent} />
      </Suspense>
      <Toaster />
    </div>
  );
}
