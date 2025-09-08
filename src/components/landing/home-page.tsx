
"use client";

import { useState, useEffect } from 'react';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Header } from '@/components/landing/header';
import { Hero } from '@/components/landing/hero';
import { Countdown } from '@/components/landing/countdown';
import { Highlights } from '@/components/landing/highlights';
import { Schedule } from '@/components/landing/schedule';
import { Guests } from '@/components/landing/guests';
import { Gallery } from '@/components/landing/gallery';
import { Sponsors } from '@/components/landing/sponsors';
import { Footer } from '@/components/landing/footer';
import { WallOfFame } from '@/components/landing/wall-of-fame';
import { WallOfContributors } from '@/components/landing/wall-of-contributors';
import { Skeleton } from '@/components/ui/skeleton';


// Loading component for the entire page
function PageLoadingSkeleton() {
  return (
    <div className="w-full space-y-8">
      <div className="h-20 w-full">
        <Skeleton className="h-full w-full" />
      </div>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="w-full py-8">
          <Skeleton className="h-8 w-64 mb-4 mx-auto" />
          <Skeleton className="h-4 w-full max-w-md mb-8 mx-auto" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto px-4">
            {Array.from({ length: 3 }).map((_, j) => (
              <Skeleton key={j} className="h-40 w-full" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export function HomePage({ content: initialContent }: { content: any }) {
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [dataFetched, setDataFetched] = useState(false);

  useEffect(() => {
    async function fetchContent() {
      try {
        // Fetch all content documents
        const contentTypes = [
          'homepage', 'slogans', 'schedule', 'guests', 'sponsors', 
          'highlights', 'settings', 'gallery', 'socials', 
          'organizers', 'contributors', 'sections'
        ];
        
        const newContent = {};
        
        for (const type of contentTypes) {
          try {
            const docRef = doc(db, "content", type);
            const docSnap = await getDoc(docRef);
            
            if (docSnap.exists()) {
              newContent[type] = docSnap.data();
            }
          } catch (error) {
            console.error(`Error fetching ${type}:`, error);
          }
        }
        
        setContent(newContent);
        setDataFetched(true);
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, []);

  // Show loading skeleton until data is fetched
  if (loading || !dataFetched) {
    return <PageLoadingSkeleton />;
  }

  return (
    <>
      <WallOfFame organizers={content.organizers?.names} loading={false} />
      <Header siteLogo={content.homepage?.siteLogo} loading={false} />
      <main className="flex-1">
        <Hero content={content.homepage} settings={content.settings} loading={false} />
        <Countdown settings={content.settings} loading={false} />
        <Guests guests={content.guests?.guests} content={content.sections?.guests} loading={false} />
        <Schedule schedule={content.schedule?.items} content={content.sections?.schedule} loading={false} />
        <Highlights highlights={content.highlights?.highlights} content={content.sections?.highlights} loading={false} />
        <Gallery gallery={content.gallery} content={content.sections?.gallery} loading={false} />
        <WallOfContributors contributors={content.contributors?.names} loading={false} />
        <Sponsors sponsors={content.sponsors?.sponsors} content={content.sections?.sponsors} loading={false} />
      </main>
      <Footer socials={content.socials} siteLogo={content.homepage?.siteLogo} content={content.sections?.footer} loading={false} />
    </>
  );
}
