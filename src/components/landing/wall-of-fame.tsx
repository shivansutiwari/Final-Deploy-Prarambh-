
"use client";

import React from 'react';
import { Crown } from 'lucide-react';

const defaultTeammates = [
    "SHIVANSHU JAISWAL (Admin)", "SATYAM UPADHYAY", "SHIVANGI SINGH", "ANURAG VISHWAKARMA", "AYUSH KUMAR", "ASHUTOSH MISHRA"
];

type WallOfFameProps = {
    organizers?: string[];
}

export function WallOfFame({ organizers }: WallOfFameProps) {
    const teammates = organizers && organizers.length > 0 ? organizers : defaultTeammates;
    const scrollItems = ["Organization Community", ...teammates];
    const allItems = [...scrollItems, ...scrollItems];

    return (
        <div className="bg-card text-primary-foreground border-b-2 border-accent">
            <div className="relative flex overflow-hidden py-3 text-sm font-medium">
                <div className="flex w-max flex-shrink-0 animate-marquee-right items-center justify-around gap-x-16">
                    {allItems.map((item, i) => {
                         const isAdmin = item.toUpperCase().includes('(ADMIN)');
                         const displayName = item.replace(/\(Admin\)/i, '').trim();

                         return (
                            <div key={i} className="flex flex-col items-center justify-center text-center px-4 h-14">
                                {item === "Organization Community" ? (
                                     <h3 className="font-headline text-xl text-amber-300 whitespace-nowrap">
                                        <span className="opacity-0">
                                            <Crown className="h-6 w-6" />
                                        </span>
                                        <span>{item}</span>
                                    </h3>
                                ) : (
                                    <>
                                        <Crown className={isAdmin ? "h-6 w-6 text-yellow-400 drop-shadow-[0_2px_4px_rgba(252,211,77,0.5)]" : "h-5 w-5 text-amber-300"} />
                                        <span className={`whitespace-nowrap font-bold text-base tracking-wider ${isAdmin ? 'text-yellow-400' : ''}`}>{displayName}</span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
                 <div aria-hidden="true" className="absolute top-0 flex w-max flex-shrink-0 animate-marquee-right items-center justify-around gap-x-16 py-3">
                     {allItems.map((item, i) => {
                         const isAdmin = item.toUpperCase().includes('(ADMIN)');
                         const displayName = item.replace(/\(Admin\)/i, '').trim();
                         
                         return (
                             <div key={i} className="flex flex-col items-center justify-center text-center px-4 h-14">
                                {item === "Organization Community" ? (
                                      <h3 className="font-headline text-xl text-amber-300 whitespace-nowrap">
                                        <span className="opacity-0">
                                            <Crown className="h-6 w-6" />
                                        </span>
                                        <span>{item}</span>
                                    </h3>
                                ) : (
                                    <>
                                        <Crown className={isAdmin ? "h-6 w-6 text-yellow-400 drop-shadow-[0_2px_4px_rgba(252,211,77,0.5)]" : "h-5 w-5 text-amber-300"} />
                                        <span className={`whitespace-nowrap font-bold text-base tracking-wider ${isAdmin ? 'text-yellow-400' : ''}`}>{displayName}</span>
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
