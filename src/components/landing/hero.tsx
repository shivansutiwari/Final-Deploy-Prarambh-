
"use client";

import React from 'react';
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Skeleton } from '../ui/skeleton';
import { Calendar, MapPin } from 'lucide-react';
import { format, parseISO } from 'date-fns';

type HeroContent = {
    presentingText?: string;
    presentingLogo?: string;
    title?: string;
    subtitle?: string;
    description?: string;
    eventYear?: string;
}

type Settings = {
    eventDate?: string;
    venue?: string;
}

const initialHeroContent = {
    presentingText: "",
    presentingLogo: "",
    title: "प्रारंभ BCA",
    subtitle: "The Tech Journey Begins Now",
    description: "Join us in welcoming the newest members of our BCA family. A time of celebration, connection, and unforgettable memories awaits.",
    eventYear: new Date().getFullYear().toString()
};

const initialSettings = {
    eventDate: "2025-08-20",
    venue: "College Auditorium"
}

export function Hero({ content, settings }: { content?: HeroContent, settings?: Settings }) {
  const heroContent = {
    presentingText: content?.presentingText,
    presentingLogo: content?.presentingLogo,
    title: content?.title || initialHeroContent.title,
    subtitle: content?.subtitle || initialHeroContent.subtitle,
    description: content?.description || initialHeroContent.description,
    eventYear: content?.eventYear || initialHeroContent.eventYear,
  };
   const eventSettings = {
    eventDate: settings?.eventDate || initialSettings.eventDate,
    venue: settings?.venue || initialSettings.venue,
  };
  
  const loading = !content || !settings;

  const formatEventDate = () => {
    if (!eventSettings.eventDate) return "";
    try {
        const date = parseISO(eventSettings.eventDate);
        return format(date, "MMMM d, yyyy");
    } catch (e) {
        return eventSettings.eventDate;
    }
  }

  return (
    <section id="home" className="relative h-[calc(100vh-80px)] min-h-[700px] w-full flex items-center justify-center text-center text-white overflow-hidden">
      <Image
        src="https://images.unsplash.com/photo-1527529482837-4698179dc6ce?q=80&w=1920"
        alt="Students at a college event"
        data-ai-hint="nightclub party fashion"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-primary/40 to-background" />
      <div className="relative z-10 container mx-auto px-4 flex flex-col items-center">
          <>
             {(heroContent.presentingText || heroContent.presentingLogo) && (
                <div className="flex items-center justify-center gap-3 mb-4 animate-fade-in-down" style={{animationDelay: '0ms'}}>
                    {heroContent.presentingLogo && (
                        <Image src={heroContent.presentingLogo} alt="Presenter Logo" width={40} height={40} className="rounded-full" />
                    )}
                    <p className="font-body text-lg md:text-xl font-semibold">{heroContent.presentingText}</p>
                </div>
            )}
            <h1 className="font-headline text-5xl md:text-8xl lg:text-[9rem] font-bold tracking-tight whitespace-nowrap animate-fade-in-down" style={{animationDelay: '100ms'}}>
               <span className="text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                {heroContent.title}
              </span>
            </h1>
             <h2 className="font-headline text-7xl md:text-9xl lg:text-[10rem] font-bold tracking-tight -mt-2 md:-mt-4 animate-fade-in-down" style={{animationDelay: '200ms'}}>
                 <span className="text-amber-300 drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]">
                  {heroContent.eventYear}
                </span>
            </h2>
            <p className="mt-4 font-body text-xl md:text-2xl lg:text-3xl drop-shadow-md font-bold italic animate-fade-in-down" style={{animationDelay: '300ms'}}>
              {heroContent.subtitle}
            </p>
            <p className="mt-6 max-w-2xl text-lg md:text-xl font-light animate-fade-in-down" style={{animationDelay: '500ms'}}>
              {heroContent.description}
            </p>
          </>
        <div className="mt-8 animate-fade-in-up" style={{animationDelay: '900ms'}}>
          <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-lg py-6 px-10 rounded-full font-bold shadow-xl transition-transform hover:scale-105">
            <Link href="#schedule">View Event Schedule</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

// Minimal CSS for animations if not in globals.css
const animationStyles = `
@keyframes fade-in-down {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in-down {
  animation: fade-in-down 0.6s ease-out forwards;
  opacity: 0;
}
.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
  opacity: 0;
}
`;

// Inject styles into the head
if (typeof window !== 'undefined') {
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = animationStyles;
    document.head.appendChild(styleSheet);
}
