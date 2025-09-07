
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
import { Loader2, Trash2, PlusCircle, Crown } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const initialNames: string[] = [''];

export default function OrganizersEditorPage() {
    const [names, setNames] = useState<string[]>(initialNames);
    const [adminIndices, setAdminIndices] = useState<number[]>([]);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "organizers");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().names) {
                    const fetchedNames = docSnap.data().names as string[];
                    if (fetchedNames.length > 0) {
                        const indices: number[] = [];
                        const cleanedNames = fetchedNames.map((name, index) => {
                            if (name.toUpperCase().includes('(ADMIN)')) {
                                indices.push(index);
                                return name.replace(/\s*\(Admin\)/i, '').trim();
                            }
                            return name;
                        });
                        setAdminIndices(indices);
                        setNames(cleanedNames);
                    } else {
                         setNames(['']);
                         setAdminIndices([]);
                    }
                }
            } catch (error) {
                console.error("Error fetching organizers:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing organizer data.",
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
            const docRef = doc(db, "content", "organizers");
            const finalNames = names
                .map((name, index) => {
                    if (adminIndices.includes(index) && name.trim() !== '') {
                        return `${name.trim()} (Admin)`;
                    }
                    return name.trim();
                })
                .filter(name => name !== '');

            await setDoc(docRef, { names: finalNames }, { merge: true });
            toast({
                title: "Organizers Saved!",
                description: "The Wall of Fame has been updated.",
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

    const handleNameChange = (index: number, value: string) => {
        const newNames = [...names];
        newNames[index] = value;
        setNames(newNames);
    };
    
    const handleAdminChange = (index: number) => {
        setAdminIndices(prev => 
            prev.includes(index) 
                ? prev.filter(i => i !== index) 
                : [...prev, index]
        );
    };

    const addName = () => {
        setNames([...names, '']);
    };

    const removeName = (index: number) => {
        const newNames = names.filter((_, i) => i !== index);
        setNames(newNames);
        setAdminIndices(prev => prev.filter(i => i !== index).map(i => i > index ? i - 1 : i));
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Organizers</h2>
                 <Button onClick={addName} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Member
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Wall of Fame</CardTitle>
                    <CardDescription>Add members and use the checkboxes to highlight them as Admins.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        {names.map((name, index) => (
                            <div key={index} className="flex items-center gap-2">
                                <Checkbox
                                    id={`admin-checkbox-${index}`}
                                    checked={adminIndices.includes(index)}
                                    onCheckedChange={() => handleAdminChange(index)}
                                />
                                <Label htmlFor={`admin-checkbox-${index}`} className="sr-only">Set {name || `member ${index+1}`} as admin</Label>
                                <Crown className="h-5 w-5 text-muted-foreground" />
                                <Input 
                                    value={name} 
                                    onChange={(e) => handleNameChange(index, e.target.value)} 
                                    placeholder="e.g., Shivanshu Jaiswal"
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => removeName(index)}
                                    disabled={names.length === 1 && name === ''}
                                >
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>
                        ))}
                    </div>
                    {names.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No members added yet. Click "Add Member" to start.</p>
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
