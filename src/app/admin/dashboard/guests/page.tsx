
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
import { Loader2, Trash2, PlusCircle, Image as ImageIcon } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';

type Guest = {
    name: string;
    title: string;
    message: string;
    image: string;
}

const initialGuests: Guest[] = [];

function GuestsEditorPage() {
    const [guests, setGuests] = useState<Guest[]>(initialGuests);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "guests");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().guests) {
                    setGuests(docSnap.data().guests as Guest[]);
                }
            } catch (error) {
                console.error("Error fetching guests:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing guest data.",
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
            const docRef = doc(db, "content", "guests");
            await setDoc(docRef, { guests }, { merge: true });
            toast({
                title: "Guests Saved!",
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

    const handleGuestChange = (index: number, field: keyof Guest, value: string) => {
        const newGuests = [...guests];
        newGuests[index] = {...newGuests[index], [field]: value};
        setGuests(newGuests);
    };

    const addGuest = () => {
        setGuests([...guests, { name: '', title: '', message: '', image: '' }]);
    };

    const removeGuest = (index: number) => {
        const newGuests = guests.filter((_, i) => i !== index);
        setGuests(newGuests);
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Honored Guests & Faculties</h2>
                 <Button onClick={addGuest} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Guest
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Guests & Faculty</CardTitle>
                    <CardDescription>Add, edit, or remove guests from the homepage section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {guests.map((guest, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                             <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-3 -right-3 h-7 w-7"
                                onClick={() => removeGuest(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`name-${index}`}>Name</Label>
                                    <Input id={`name-${index}`} value={guest.name} onChange={(e) => handleGuestChange(index, 'name', e.target.value)} placeholder="Dr. Evelyn Reed"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${index}`}>Title / Role</Label>
                                    <Input id={`title-${index}`} value={guest.title} onChange={(e) => handleGuestChange(index, 'title', e.target.value)} placeholder="Chief Guest | AI Ethicist"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`image-${index}`}>Image URL</Label>
                                 <div className="flex items-center gap-2">
                                   <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                   <Input id={`image-${index}`} value={guest.image} onChange={(e) => handleGuestChange(index, 'image', e.target.value)} placeholder="https://example.com/guest.png"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`message-${index}`}>Inspirational Message</Label>
                                <Textarea id={`message-${index}`} value={guest.message} onChange={(e) => handleGuestChange(index, 'message', e.target.value)} placeholder="The future is not something we enter. The future is something we create..."/>
                            </div>
                        </div>
                    ))}
                    {guests.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No guests added yet. Click &quot;Add Guest&quot; to start.</p>
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

export default withDynamicImport(GuestsEditorPage);
