
"use client";

import Link from "next/link";
import { PrarambhIcon } from "@/components/icons";
import React from "react";
import { Mail, Instagram, Linkedin, Lock, Link as LinkIcon, Youtube, Facebook, Twitter, Send, MapPin, Phone } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";

type Socials = {
    website?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    telegram?: string;
    location?: string;
    mobile?: string;
    gmail?: string;
}

type FooterContent = {
    description?: string;
    copyright?: string;
}

const defaultContent = {
    description: "The beginning of a new chapter for the students of BCA.",
    copyright: ""
}

export function Footer({ socials, siteLogo, content }: { socials?: Socials, siteLogo?: string, content?: FooterContent }) {
    const currentYear = new Date().getFullYear();
    const footerContent = content ? { ...defaultContent, ...content } : defaultContent;

    const copyrightText = footerContent.copyright || `© ${currentYear} Prarambh BCA. All Rights Reserved.`;

    return (
        <footer className="bg-card text-card-foreground border-t border-border">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-left">
                    <div className="flex flex-col items-center md:items-start md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 font-headline text-2xl font-bold mb-4">
                           {siteLogo ? (
                                <Image src={siteLogo} alt="Prarambh Logo" width={180} height={60} className="object-contain h-20 invert" />
                            ) : (
                                <>
                                    <PrarambhIcon className="h-8 w-8 text-primary" />
                                    <span>Prarambh</span>
                                </>
                            )}
                        </Link>
                        <p className="text-sm text-muted-foreground max-w-xs">
                            {footerContent.description}
                        </p>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Quick Links</h3>
                        <ul className="space-y-2 text-muted-foreground">
                            <li><Link href="#home" className="hover:text-foreground hover:underline">Home</Link></li>
                            <li><Link href="#guests" className="hover:text-foreground hover:underline">Guests</Link></li>
                            <li><Link href="#schedule" className="hover:text-foreground hover:underline">Schedule</Link></li>
                            <li><Link href="#gallery" className="hover:text-foreground hover:underline">Gallery</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-headline text-xl font-semibold mb-4 text-primary">Follow & Contact</h3>
                        <div className="flex justify-center md:justify-start flex-wrap gap-2">
                            {socials?.website && <Button variant="outline" size="icon" asChild><a href={socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website"><LinkIcon className="w-4 h-4" /></a></Button>}
                            {socials?.youtube && <Button variant="outline" size="icon" asChild><a href={socials.youtube} target="_blank" rel="noopener noreferrer" aria-label="YouTube"><Youtube className="w-4 h-4" /></a></Button>}
                            {socials?.facebook && <Button variant="outline" size="icon" asChild><a href={socials.facebook} target="_blank" rel="noopener noreferrer" aria-label="Facebook"><Facebook className="w-4 h-4" /></a></Button>}
                            {socials?.instagram && <Button variant="outline" size="icon" asChild><a href={socials.instagram} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram className="w-4 h-4" /></a></Button>}
                            {socials?.twitter && <Button variant="outline" size="icon" asChild><a href={socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter/X"><Twitter className="w-4 h-4" /></a></Button>}
                            {socials?.linkedin && <Button variant="outline" size="icon" asChild><a href={socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn"><Linkedin className="w-4 h-4" /></a></Button>}
                            {socials?.telegram && <Button variant="outline" size="icon" asChild><a href={socials.telegram} target="_blank" rel="noopener noreferrer" aria-label="Telegram"><Send className="w-4 h-4" /></a></Button>}
                            {socials?.location && <Button variant="outline" size="icon" asChild><a href={socials.location} target="_blank" rel="noopener noreferrer" aria-label="Location"><MapPin className="w-4 h-4" /></a></Button>}
                            {socials?.mobile && <Button variant="outline" size="icon" asChild><a href={`tel:+91${socials.mobile}`} aria-label="Call"><Phone className="w-4 h-4" /></a></Button>}
                            {socials?.gmail && <Button variant="outline" size="icon" asChild><a href={`mailto:${socials.gmail}`} aria-label="Gmail"><Mail className="h-4 h-4" /></a></Button>}
                        </div>
                    </div>
                </div>
                <div className="mt-8 pt-6 border-t border-border text-center text-sm text-muted-foreground flex justify-between items-center flex-col md:flex-row gap-2">
                    <p>{copyrightText}</p>
                     <Link href="/admin/login" aria-label="Admin Login" className="text-muted-foreground hover:text-primary transition-colors">
                        <Lock className="h-3.5 w-3.5"/>
                    </Link>
                </div>
            </div>
        </footer>
    );
}
