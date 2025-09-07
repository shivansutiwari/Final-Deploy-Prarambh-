
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';

const initialSlogans: string[] = [];

function SlogansEditorPage() {
    const [slogans, setSlogans] = useState(initialSlogans);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "slogans");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().slogans) {
                    setSlogans(docSnap.data().slogans as string[]);
                }
            } catch (error) {
                console.error("Error fetching slogans:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing slogans.",
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
            const docRef = doc(db, "content", "slogans");
            await setDoc(docRef, { slogans }, { merge: true });
            toast({
                title: "Slogans Saved!",
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

    const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
        setSlogans(lines);
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Slogans</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Marquee Slogans</CardTitle>
                    <CardDescription>Enter each slogan on a new line. These will scroll at the very top of your website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="slogans">Slogans (one per line)</Label>
                        <Textarea 
                            id="slogans" 
                            value={slogans.join('\n')} 
                            onChange={handleTextChange} 
                            placeholder="Welcoming the Future of Excellence\nWhere Journeys Begin\nCelebrating New Beginnings"
                            rows={6}
                        />
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

export default withDynamicImport(SlogansEditorPage);
