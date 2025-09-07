
"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "../ui/skeleton";
import { cn } from "@/lib/utils";
import { Link as LinkIcon, Linkedin, Twitter, Youtube, Facebook, Instagram, Send, MapPin, Phone, MessageSquare } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";


type Sponsor = {
    name: string;
    description: string;
    image: string;
    pictureUrl?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    location?: string;
    mobile?: string;
};

type SectionContent = {
    title: string;
    description: string;
};

const initialSponsors: Sponsor[] = [
    {
        name: "Innovate Inc.",
        description: "Leading the charge in futuristic technology and software solutions.",
        image: "https://placehold.co/400x400/7d3ac1/FFFFFF?text=Innovate",
        website: "#",
        linkedin: "#",
        twitter: "#"
    },
    {
        name: "Quantum Leap",
        description: "Pioneering the next generation of quantum computing.",
        image: "https://placehold.co/400x400/3ab1c1/FFFFFF?text=Quantum",
        website: "#",
    },
     {
        name: "Synergy Group",
        description: "Building connections and fostering collaboration across industries.",
        image: "https://placehold.co/400x400/c13a6e/FFFFFF?text=Synergy",
        website: "#",
        linkedin: "#",
    }
];

const defaultContent = {
    title: "Sponsored By",
    description: "We are grateful to our sponsors for their generous support."
};


function SponsorAccordionItem({ sponsor, index }: { sponsor: Sponsor, index: number }) {
    const logoUrl = sponsor.image && sponsor.image.trim() ? sponsor.image.trim() : null;
    const pictureUrl = sponsor.pictureUrl && sponsor.pictureUrl.trim() ? sponsor.pictureUrl.trim() : null;

    return (
        <AccordionItem value={`item-${index}`}>
            <AccordionTrigger className="font-headline text-xl hover:no-underline">
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {logoUrl ? (
                            <Image
                                src={logoUrl}
                                alt={`${sponsor.name} logo`}
                                width={40}
                                height={40}
                                className="object-contain rounded-md bg-white p-1"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-md bg-muted flex items-center justify-center text-muted-foreground text-xs">
                                Logo
                            </div>
                        )}
                    </div>
                    <span>{sponsor.name}</span>
                </div>
            </AccordionTrigger>
            <AccordionContent className="pl-14 text-muted-foreground">
                <div className="space-y-4">
                    <p>{sponsor.description}</p>
                     {pictureUrl && (
                        <div className="mt-4 relative aspect-video">
                            <Image
                                src={pictureUrl}
                                alt={`Picture for ${sponsor.name}`}
                                fill
                                className="object-cover rounded-lg"
                            />
                        </div>
                    )}
                    <div className="flex gap-2 flex-wrap items-center">
                        {sponsor.website && <Button variant="outline" size="icon" asChild><a href={sponsor.website} target="_blank" rel="noopener noreferrer" aria-label="Website"><LinkIcon className="w-4 h-4" /></a></Button>}
                        {sponsor.youtube && <Button variant="outline" size="icon" asChild><a href={sponsor.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube className="w-4 h-4" /></a></Button>}
                        {sponsor.facebook && <Button variant="outline" size="icon" asChild><a href={sponsor.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="w-4 h-4" /></a></Button>}
                        {sponsor.instagram && <Button variant="outline" size="icon" asChild><a href={sponsor.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-4 h-4" /></a></Button>}
                        {sponsor.twitter && <Button variant="outline" size="icon" asChild><a href={sponsor.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><Twitter className="w-4 h-4" /></a></Button>}
                        {sponsor.linkedin && <Button variant="outline" size="icon" asChild><a href={sponsor.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a></Button>}
                        {sponsor.telegram && <Button variant="outline" size="icon" asChild><a href={sponsor.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Send className="w-4 h-4" /></a></Button>}
                        {sponsor.location && <Button variant="outline" size="icon" asChild><a href={sponsor.location} target="_blank" rel="noopener noreferrer" aria-label="Location"><MapPin className="w-4 h-4" /></a></Button>}
                        {sponsor.mobile && (
                             <Button variant="outline" size="sm" asChild>
                                <a href={`tel:+91${sponsor.mobile}`} aria-label="Call">
                                    <Phone className="w-4 h-4 mr-2" />
                                    +91 {sponsor.mobile}
                                </a>
                            </Button>
                        )}
                    </div>
                </div>
            </AccordionContent>
        </AccordionItem>
    );
}


function SponsorSkeleton() {
    return (
        <div className="flex items-center justify-between p-4 border-b">
            <div className="flex items-center gap-4">
                <Skeleton className="w-10 h-10 rounded-md" />
                <Skeleton className="h-6 w-40" />
            </div>
            <Skeleton className="h-6 w-6" />
        </div>
    );
}


export function Sponsors({ sponsors: serverSponsors, content }: { sponsors?: Sponsor[], content?: SectionContent }) {
  const hasServerData = !!serverSponsors;
  const sponsors = serverSponsors && serverSponsors.length > 0 ? serverSponsors : initialSponsors;
  const { title, description } = content || defaultContent;
  
  if (hasServerData && sponsors.length === 0) {
    return null;
  }

  return (
    <section id="sponsors" className="bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto">
             <Accordion type="single" collapsible className="w-full">
                {!hasServerData ? (
                    Array.from({length: 3}).map((_, i) => <SponsorSkeleton key={i} />)
                ) : (
                    sponsors.map((sponsor, index) => (
                        <SponsorAccordionItem key={index} sponsor={sponsor} index={index} />
                    ))
                )}
            </Accordion>
        </div>
      </div>
    </section>
  );
}
