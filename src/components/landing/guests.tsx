
"use client";

import { useState } from "react";
import Image from "next/image";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Skeleton } from "../ui/skeleton";

type Guest = {
    name: string;
    title: string;
    message: string;
    image?: string;
};

type SectionContent = {
    title: string;
    description: string;
}

const initialGuests: Guest[] = [
  {
    name: "Dr. Evelyn Reed",
    title: "Chief Guest | AI Ethicist",
    message: "The future is not something we enter. The future is something we create. Create a great one.",
    image: "https://placehold.co/400x400/E7EAF7/4169E1?text=ER"
  },
  {
    name: "Prof. Samuel Chen",
    title: "Head of Department",
    message: "Your journey in computer applications is just beginning. Stay curious, work hard, and the possibilities are endless.",
    image: "https://placehold.co/400x400/E7EAF7/4169E1?text=SC"
  },
  {
    name: "Ms. Anita Desai",
    title: "Guest of Honor | Tech Entrepreneur",
    message: "Embrace challenges as opportunities. Your ability to solve problems will define your success.",
    image: "https://placehold.co/400x400/E7EAF7/4169E1?text=AD"
  },
];

const defaultContent = {
    title: "Our Honored Guests & Faculties",
    description: "Meet the distinguished guests and faculty gracing the occasion with their presence."
};

function GuestCard({ guest }: { guest: Guest }) {
  const getInitials = (name: string) => {
    if (!name) return 'G';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[names.length - 1][0]}`;
    }
    return name.substring(0, 2);
  }
  
  const guestImage = guest.image && guest.image.trim() ? guest.image.trim() : null;

  return (
     <Card className="w-full h-auto overflow-hidden bg-card border-border/50 group">
        <CardContent className="p-6 text-center flex flex-col items-center">
            {guestImage ? (
                 <Dialog>
                    <DialogTrigger asChild>
                         <Avatar className="w-20 h-20 mb-4 border-2 border-primary group-hover:border-accent transition-colors duration-300 cursor-pointer">
                            <AvatarImage src={guestImage} alt={guest.name} />
                            <AvatarFallback className="text-2xl bg-muted text-muted-foreground">{getInitials(guest.name)}</AvatarFallback>
                        </Avatar>
                    </DialogTrigger>
                    <DialogContent className="p-0 max-w-lg bg-transparent border-0">
                         <DialogHeader>
                            <DialogTitle className="sr-only">{guest.name}</DialogTitle>
                         </DialogHeader>
                        <Image 
                            src={guestImage} 
                            alt={`Full view of ${guest.name}`} 
                            width={500}
                            height={500}
                            className="rounded-lg object-cover"
                        />
                    </DialogContent>
                </Dialog>
            ) : (
                <Avatar className="w-20 h-20 mb-4 border-2 border-primary group-hover:border-accent transition-colors duration-300">
                    <AvatarFallback className="text-2xl bg-muted text-muted-foreground">{getInitials(guest.name)}</AvatarFallback>
                </Avatar>
            )}
           
            <h3 className="font-headline text-xl font-bold text-card-foreground">{guest.name}</h3>
            <p className="text-sm text-accent font-medium mb-4">{guest.title}</p>
            <div className="border-t border-border w-1/4 my-2"></div>
            <p className="text-muted-foreground italic mt-2">&quot;{guest.message}&quot;</p>
        </CardContent>
      </Card>
  )
}

function GuestSkeleton() {
    return (
        <Card className="w-full h-auto overflow-hidden bg-card border-border/50">
            <CardContent className="p-6 text-center flex flex-col items-center">
                <Skeleton className="w-20 h-20 rounded-full mb-4" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <div className="border-t border-border w-1/4 my-2"></div>
                <Skeleton className="h-4 w-full mt-2" />
                <Skeleton className="h-4 w-5/6 mt-1" />
            </CardContent>
        </Card>
    )
}

export function Guests({ guests: serverGuests, content }: { guests?: Guest[], content?: SectionContent }) {
  const guests = serverGuests && serverGuests.length > 0 ? serverGuests : initialGuests;
  const loading = !serverGuests;
  const { title, description } = content || defaultContent;

  return (
    <section id="guests">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="font-headline text-4xl md:text-5xl font-bold">{title}</h2>
          <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
            {description}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {loading ? (
                <>
                    <GuestSkeleton />
                    <GuestSkeleton />
                    <GuestSkeleton />
                </>
            ) : (
                guests.map((guest, index) => (
                    <GuestCard key={index} guest={guest} />
                ))
            )}
        </div>
      </div>
    </section>
  );
}
