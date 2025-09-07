
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


export function HomePage({ content: initialContent }: { content: any }) {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchContent() {
      try {
        // Fetch all content documents
        const contentTypes = [
          'homepage', 'slogans', 'schedule', 'guests', 'sponsors', 
          'highlights', 'settings', 'gallery', 'socials', 
          'organizers', 'contributors', 'sections'
        ];
        
        const newContent = { ...initialContent };
        
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
      } catch (error) {
        console.error("Error fetching content:", error);
      } finally {
        setLoading(false);
      }
    }
    
    fetchContent();
  }, [initialContent]);

  return (
    <>
      <WallOfFame organizers={content.organizers?.names} />
      <Header siteLogo={content.homepage?.siteLogo}/>
      <main className="flex-1">
        <Hero content={content.homepage} settings={content.settings} />
        <Countdown settings={content.settings} />
        <Guests guests={content.guests?.guests} content={content.sections?.guests} />
        <Schedule schedule={content.schedule?.items} content={content.sections?.schedule} />
        <Highlights highlights={content.highlights?.highlights} content={content.sections?.highlights} />
        <Gallery gallery={content.gallery} content={content.sections?.gallery} />
        <WallOfContributors contributors={content.contributors?.names} />
        <Sponsors sponsors={content.sponsors?.sponsors} content={content.sections?.sponsors} />
      </main>
      <Footer socials={content.socials} siteLogo={content.homepage?.siteLogo} content={content.sections?.footer} />
    </>
  );
}
