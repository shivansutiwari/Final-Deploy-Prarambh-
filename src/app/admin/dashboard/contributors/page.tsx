
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

const initialContributors: string[] = [];

// Use withDynamicImport HOC to prevent Firebase initialization during static export

function ContributorsEditor() {
    const [contributors, setContributors] = useState(initialContributors);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "contributors");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().names) {
                    setContributors(docSnap.data().names as string[]);
                }
            } catch (error) {
                console.error("Error fetching contributors:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing contributor data.",
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
            const docRef = doc(db, "content", "contributors");
            // Filter out empty lines and trim whitespace
            const finalContributors = contributors.filter(name => name.trim() !== '').map(name => name.trim());
            await setDoc(docRef, { names: finalContributors }, { merge: true });
            toast({
                title: "Contributors Saved!",
                description: "The Wall of Contributors has been updated.",
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
        const lines = e.target.value.split('\n');
        setContributors(lines);
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Contributors</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wall of Contributors</CardTitle>
                    <CardDescription>
                       Add or paste a list of contributors below. Each name should be on a new line.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="contributors">Contributors (one name per line)</Label>
                        <Textarea 
                            id="contributors" 
                            value={contributors.join('\n')} 
                            onChange={handleTextChange} 
                            placeholder="Aditya Singh\nBhavna Sharma\nChirag Gupta..."
                            rows={15}
                        />
                         <p className="text-xs text-muted-foreground pt-1">You can copy and paste a list from a text file or spreadsheet here.</p>
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

export default withDynamicImport(ContributorsEditor);
