
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
import { Loader2, Trash2, PlusCircle, Clock } from 'lucide-react';

type ScheduleItem = {
    time: string;
    title: string;
    description: string;
}

const initialSchedule: ScheduleItem[] = [];

export default function ScheduleEditorPage() {
    const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "schedule");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().items) {
                    setSchedule(docSnap.data().items as ScheduleItem[]);
                }
            } catch (error) {
                console.error("Error fetching schedule:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing schedule data.",
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
            const docRef = doc(db, "content", "schedule");
            await setDoc(docRef, { items: schedule }, { merge: true });
            toast({
                title: "Schedule Saved!",
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

    const handleItemChange = (index: number, field: keyof ScheduleItem, value: string) => {
        const newSchedule = [...schedule];
        newSchedule[index] = {...newSchedule[index], [field]: value};
        setSchedule(newSchedule);
    };

    const addItem = () => {
        setSchedule([...schedule, { time: '', title: '', description: '' }]);
    };

    const removeItem = (index: number) => {
        const newSchedule = schedule.filter((_, i) => i !== index);
        setSchedule(newSchedule);
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Event Schedule</h2>
                 <Button onClick={addItem} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Item
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Schedule Items</CardTitle>
                    <CardDescription>Add, edit, or remove items from the event schedule.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {schedule.map((item, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                             <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-3 -right-3 h-7 w-7"
                                onClick={() => removeItem(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`time-${index}`}>Time</Label>
                                     <div className="flex items-center gap-2">
                                       <Clock className="h-5 w-5 text-muted-foreground" />
                                       <Input id={`time-${index}`} value={item.time} onChange={(e) => handleItemChange(index, 'time', e.target.value)} placeholder="6:00 PM - 6:30 PM"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`title-${index}`}>Title</Label>
                                    <Input id={`title-${index}`} value={item.title} onChange={(e) => handleItemChange(index, 'title', e.target.value)} placeholder="Welcome & Registration"/>
                                </div>
                            </div>
                           
                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea id={`description-${index}`} value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} placeholder="Guests arrive, check-in at the registration desk..."/>
                            </div>
                        </div>
                    ))}
                    {schedule.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No schedule items added yet. Click &quot;Add Item&quot; to start.</p>
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
