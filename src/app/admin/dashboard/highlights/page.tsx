
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
import { Loader2, Trash2, PlusCircle } from 'lucide-react';

type Highlight = {
    icon: string;
    title: string;
    description: string;
}

const initialHighlights: Highlight[] = [];

// Helper to convert strings to PascalCase for lucide-react icons
const toPascalCase = (str: string) => {
  if (!str) return '';
  return str.replace(/(^\w|-\w)/g, (text) => text.replace(/-/, "").toUpperCase());
};

export default function HighlightsEditorPage() {
    const [highlights, setHighlights] = useState<Highlight[]>(initialHighlights);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "highlights");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().highlights) {
                    setHighlights(docSnap.data().highlights as Highlight[]);
                }
            } catch (error) {
                console.error("Error fetching highlights:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing highlight data.",
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
            const docRef = doc(db, "content", "highlights");
            const formattedHighlights = highlights.map(h => ({...h, icon: toPascalCase(h.icon)}));
            await setDoc(docRef, { highlights: formattedHighlights }, { merge: true });
            toast({
                title: "Highlights Saved!",
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

    const handleHighlightChange = (index: number, field: keyof Highlight, value: string) => {
        const newHighlights = [...highlights];
        newHighlights[index] = {...newHighlights[index], [field]: value};
        setHighlights(newHighlights);
    };

    const addHighlight = () => {
        setHighlights([...highlights, { icon: 'Sparkles', title: '', description: '' }]);
    };

    const removeHighlight = (index: number) => {
        const newHighlights = highlights.filter((_, i) => i !== index);
        setHighlights(newHighlights);
    };

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
                <h2 className="text-3xl font-bold tracking-tight">Manage Highlights</h2>
                 <Button onClick={addHighlight} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Highlight
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Highlights</CardTitle>
                    <CardDescription>Add, edit, or remove highlights from the homepage section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {highlights.map((highlight, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                             <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-3 -right-3 h-7 w-7"
                                onClick={() => removeHighlight(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${index}`}>Title</Label>
                                    <Input id={`title-${index}`} value={highlight.title} onChange={(e) => handleHighlightChange(index, 'title', e.target.value)} placeholder="Live DJ & Music"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`icon-${index}`}>Icon Name</Label>
                                    <Input 
                                        id={`icon-${index}`} 
                                        value={highlight.icon} 
                                        onChange={(e) => handleHighlightChange(index, 'icon', e.target.value)} 
                                        placeholder="e.g., PartyPopper or music"
                                    />
                                     <p className="text-xs text-muted-foreground pt-1">Find icon names on <a href="https://lucide.dev/icons/" target="_blank" rel="noopener noreferrer" className="underline hover:text-primary">lucide.dev</a>. Use PascalCase (e.g., PartyPopper) or lowercase (e.g., party-popper).</p>
                                </div>
                            </div>
                           
                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea id={`description-${index}`} value={highlight.description} onChange={(e) => handleHighlightChange(index, 'description', e.target.value)} placeholder="Get ready to groove to the beats..."/>
                            </div>
                        </div>
                    ))}
                    {highlights.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No highlights added yet. Click &quot;Add Highlight&quot; to start.</p>
                    )}
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
