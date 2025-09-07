
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

export default function WarningSloganEditorPage() {
    const [slogan, setSlogan] = useState('');
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "login_warning");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().slogan) {
                    setSlogan(docSnap.data().slogan as string);
                }
            } catch (error) {
                console.error("Error fetching warning slogan:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load the existing warning slogan.",
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
            const docRef = doc(db, "content", "login_warning");
            await setDoc(docRef, { slogan }, { merge: true });
            toast({
                title: "Warning Slogan Saved!",
                description: "Your change has been updated.",
            });
            router.push('/admin/dashboard');
        } catch (error) {
            console.error("Error saving content:", error);
            toast({
                title: "Save Failed",
                description: "Could not save your change.",
                variant: "destructive"
            });
        } finally {
             setLoading(false);
        }
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Login Warning</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Invalid Credentials Warning</CardTitle>
                    <CardDescription>This message will be shown on the login page after a failed login attempt.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="slogan">Warning Message</Label>
                        <Textarea 
                            id="slogan" 
                            value={slogan} 
                            onChange={(e) => setSlogan(e.target.value)} 
                            placeholder="Warning: Unauthorized access is monitored..."
                            rows={3}
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button onClick={handleSave} disabled={loading}>
                        {loading ? "Saving..." : "Save Change"}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}
