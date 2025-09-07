
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2 } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';
import { format } from 'date-fns';

const initialSettings = {
    eventDate: "",
    eventTime: "",
    venue: ""
};

function SettingsPage() {
    const [settings, setSettings] = useState(initialSettings);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "settings");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setSettings(docSnap.data() as typeof initialSettings);
                }
            } catch (error) {
                console.error("Error fetching settings content:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing settings data.",
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
            const docRef = doc(db, "content", "settings");
            await setDoc(docRef, settings, { merge: true });
            toast({
                title: "Settings Saved!",
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

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setSettings(prev => ({...prev, [id]: value}));
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Event Settings</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Details</CardTitle>
                    <CardDescription>Update the date, time, and venue for the event. This will update the countdown timer on the homepage.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="eventDate">Event Date</Label>
                        <Input id="eventDate" type="date" value={settings.eventDate} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="eventTime">Event Time</Label>
                        <Input id="eventTime" type="time" value={settings.eventTime} onChange={handleInputChange} />
                    </div>
                     <div className="space-y-2">
                        <Label htmlFor="venue">Venue</Label>
                        <Input id="venue" value={settings.venue} onChange={handleInputChange} placeholder="College Auditorium"/>
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

export default withDynamicImport(SettingsPage);
