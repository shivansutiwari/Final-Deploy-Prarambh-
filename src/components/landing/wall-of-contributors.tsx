
"use client";

import React from 'react';
import { Heart } from 'lucide-react';

const defaultContributors = [
    "Contributor One", "Contributor Two", "Contributor Three", "Contributor Four", "Contributor Five"
];

type WallOfContributorsProps = {
    contributors?: string[];
}

export function WallOfContributors({ contributors }: WallOfContributorsProps) {
    const contributorList = contributors && contributors.length > 0 ? contributors : defaultContributors;
    const scrollItems = ["Our Valued Contributors", ...contributorList];

    if (!contributors || contributors.length === 0) {
        return null;
    }

    const MarqueeContent = () => (
        <div className="flex-shrink-0 flex items-center justify-around w-max">
            {scrollItems.map((item, i) => (
                <div key={i} className="flex items-center justify-center text-center h-10 px-8">
                    {item === "Our Valued Contributors" ? (
                        <h3 className="font-headline text-xl text-primary whitespace-nowrap px-8">
                            {item}
                        </h3>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Heart className="h-4 w-4 text-primary/80" />
                            <span className="whitespace-nowrap font-bold text-base tracking-wider">{item}</span>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="bg-muted text-muted-foreground border-b border-t border-border">
            <div className="relative flex overflow-x-hidden py-3 text-sm font-medium">
                <div className="animate-marquee-left whitespace-nowrap flex w-max">
                   <MarqueeContent />
                   <MarqueeContent />
                </div>
            </div>
        </div>
    );
}
