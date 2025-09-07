
import { HomePage } from '@/components/landing/home-page';
import { Toaster } from "@/components/ui/toaster";

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

export default function Home() {
  return (
    <div className="flex flex-col min-h-dvh bg-background">
      <HomePage content={defaultContent} />
      <Toaster />
    </div>
  );
}
