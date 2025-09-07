
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';

const initialHeroContent = {
    presentingText: "",
    presentingLogo: "",
    title: "",
    subtitle: "",
    description: "",
    siteLogo: "",
    eventYear: ""
};

export default function HomepageEditorPage() {
    const [heroContent, setHeroContent] = useState(initialHeroContent);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "homepage");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setHeroContent(docSnap.data() as typeof initialHeroContent);
                }
            } catch (error) {
                console.error("Error fetching homepage content:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing homepage data.",
                    variant: "destructive"
                });
            } finally {
                setPageLoading(false);
            }
        }
        fetchContent();
    }, [toast]);

    const handleSave = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "content", "homepage");
            await setDoc(docRef, heroContent, { merge: true });
            toast({
                title: "Homepage Content Saved!",
                description: "Your changes have been updated.",
            });
            router.push('/admin/dashboard');
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Save Failed",
                description: "Could not save your changes.",
                variant: "destructive"
            });
        } finally {
             setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;
        setHeroContent(prev => ({...prev, [id]: value}));
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Homepage</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Hero Section & Site Logo</CardTitle>
                    <CardDescription>Update the main content and the primary logo for your website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2 p-4 border rounded-lg">
                        <Label htmlFor="siteLogo">Site Logo URL</Label>
                        <Input id="siteLogo" value={heroContent.siteLogo || ''} onChange={handleInputChange} placeholder="https://example.com/site-logo.png"/>
                        <p className="text-xs text-muted-foreground pt-1">This logo will appear in the header. Leave blank to use default text logo.</p>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="presentingText">Presenter Text</Label>
                        <Input id="presentingText" value={heroContent.presentingText || ''} onChange={handleInputChange} placeholder="e.g., Veer Bahadur Singh Purvanchal University Presenting..."/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="presentingLogo">Presenter Logo URL</Label>
                        <Input id="presentingLogo" value={heroContent.presentingLogo || ''} onChange={handleInputChange} placeholder="https://example.com/logo.png"/>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Main Title</Label>
                            <Input id="title" value={heroContent.title} onChange={handleInputChange} placeholder="प्रारंभ BCA"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="eventYear">Event Year</Label>
                            <Input id="eventYear" value={heroContent.eventYear || ''} onChange={handleInputChange} placeholder="e.g., 2025"/>
                        </div>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="subtitle">Subtitle</Label>
                        <Input id="subtitle" value={heroContent.subtitle} onChange={handleInputChange} placeholder="The Tech Journey Begins Now"/>
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" value={heroContent.description} onChange={handleInputChange} placeholder="A short paragraph describing the event."/>
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
