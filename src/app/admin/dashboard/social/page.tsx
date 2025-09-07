
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Instagram, Linkedin, Loader2, Mail, Link as LinkIcon, Youtube, Facebook, Twitter, Send, MapPin, Phone } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const initialSocials = {
    instagram: "",
    linkedin: "",
    gmail: "",
    website: "",
    youtube: "",
    facebook: "",
    twitter: "",
    telegram: "",
    location: "",
    mobile: "",
};

function SocialMediaPage() {
    const [socials, setSocials] = useState(initialSocials);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchSocials() {
            try {
                const docRef = doc(db, "content", "socials");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSocials(docSnap.data() as typeof initialSocials);
                }
            } catch (error) {
                console.error("Error fetching social links:", error);
                 toast({
                    title: "Error fetching links",
                    description: "Could not load existing social media links.",
                    variant: "destructive"
                });
            } finally {
                setPageLoading(false);
            }
        }
        fetchSocials();
    }, [toast]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "content", "socials");
            await setDoc(docRef, socials, { merge: true });
            toast({
                title: "Social Links Saved!",
                description: "Your social media links have been updated.",
            });
            router.push('/admin/dashboard');
        } catch (error) {
             console.error("Error saving social links:", error);
            toast({
                title: "Save Failed",
                description: "Could not save your social links.",
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        let processedValue = value;

        if (id === 'mobile') {
            const numericValue = value.replace(/[^0-9]/g, '');
            processedValue = numericValue.slice(0, 10);
        }

        setSocials(prev => ({...prev, [id]: processedValue}));
    }

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="p-4 md:p-8 pt-6 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Social Media & Contact</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Edit Social & Contact Links</CardTitle>
                    <CardDescription>Update the URLs and contact info for your event. These will be reflected on the homepage footer.</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                     <div className="space-y-2">
                        <Label htmlFor="website">Website</Label>
                        <div className="flex items-center gap-2">
                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                            <Input id="website" value={socials.website || ''} onChange={handleInputChange} placeholder="https://your-event.com"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="youtube">YouTube</Label>
                        <div className="flex items-center gap-2">
                            <Youtube className="h-5 w-5 text-muted-foreground" />
                            <Input id="youtube" value={socials.youtube || ''} onChange={handleInputChange} placeholder="https://youtube.com/your-channel"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="facebook">Facebook</Label>
                        <div className="flex items-center gap-2">
                            <Facebook className="h-5 w-5 text-muted-foreground" />
                            <Input id="facebook" value={socials.facebook || ''} onChange={handleInputChange} placeholder="https://facebook.com/your-page"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="instagram">Instagram</Label>
                        <div className="flex items-center gap-2">
                            <Instagram className="h-5 w-5 text-muted-foreground" />
                            <Input id="instagram" value={socials.instagram || ''} onChange={handleInputChange} placeholder="https://instagram.com/your-profile"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="twitter">Twitter / X</Label>
                        <div className="flex items-center gap-2">
                            <Twitter className="h-5 w-5 text-muted-foreground" />
                            <Input id="twitter" value={socials.twitter || ''} onChange={handleInputChange} placeholder="https://twitter.com/your-handle"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <div className="flex items-center gap-2">
                            <Linkedin className="h-5 w-5 text-muted-foreground" />
                            <Input id="linkedin" value={socials.linkedin || ''} onChange={handleInputChange} placeholder="https://linkedin.com/in/your-profile"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="telegram">Telegram</Label>
                        <div className="flex items-center gap-2">
                            <Send className="h-5 w-5 text-muted-foreground" />
                            <Input id="telegram" value={socials.telegram || ''} onChange={handleInputChange} placeholder="https://t.me/your-channel"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="location">Location (Google Maps URL)</Label>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-muted-foreground" />
                            <Input id="location" value={socials.location || ''} onChange={handleInputChange} placeholder="https://maps.app.goo.gl/your-location"/>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="mobile">Mobile No.</Label>
                        <div className="flex items-center gap-2">
                            <Phone className="h-5 w-5 text-muted-foreground" />
                            <div className="flex items-center w-full">
                                <span className="inline-flex items-center px-3 text-sm text-muted-foreground border border-r-0 border-input rounded-l-md h-10 bg-muted">
                                    +91
                                </span>
                                <Input id="mobile" type="tel" value={socials.mobile || ''} onChange={handleInputChange} placeholder="1234567890" className="rounded-l-none"/>
                            </div>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="gmail">Gmail</Label>
                        <div className="flex items-center gap-2">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <Input id="gmail" value={socials.gmail || ''} onChange={handleInputChange} placeholder="your.email@gmail.com"/>
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Changes"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}

export default withDynamicImport(SocialMediaPage);
