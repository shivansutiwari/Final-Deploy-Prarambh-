
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from '@/components/ui/textarea';
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db, storage } from '@/lib/firebase';
import { Loader2, Trash2, PlusCircle, Image as ImageIcon, Link as LinkIcon, Youtube, Facebook, Instagram, Twitter, Linkedin, Send, MapPin, Upload, Phone } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';

type Sponsor = {
    name: string;
    description: string;
    image: string;
    pictureUrl?: string;
    website?: string;
    linkedin?: string;
    twitter?: string;
    youtube?: string;
    facebook?: string;
    instagram?: string;
    telegram?: string;
    location?: string;
    mobile?: string;
}

const initialSponsors: Sponsor[] = [];

function SponsorsEditorPage() {
    const [sponsors, setSponsors] = useState<Sponsor[]>(initialSponsors);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "sponsors");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().sponsors) {
                    setSponsors(docSnap.data().sponsors as Sponsor[]);
                }
            } catch (error) {
                console.error("Error fetching sponsors:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing sponsor data.",
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
            const docRef = doc(db, "content", "sponsors");
            await setDoc(docRef, { sponsors }, { merge: true });
            toast({
                title: "Sponsors Saved!",
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

    const handleSponsorChange = (index: number, field: keyof Sponsor, value: string) => {
        const newSponsors = [...sponsors];
        let processedValue = value;

        if (field === 'mobile') {
            const numericValue = value.replace(/[^0-9]/g, '');
            processedValue = numericValue.slice(0, 10);
        }

        newSponsors[index] = {...newSponsors[index], [field]: processedValue};
        setSponsors(newSponsors);
    };

    const handleImageUpload = (index: number, file: File, field: 'image' | 'pictureUrl') => {
        if (!file) return;

        const storageRef = ref(storage, `sponsors/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {
            },
            (error) => {
                console.error("Upload failed:", error);
                toast({
                    title: "Upload Failed",
                    description: "Could not upload the image.",
                    variant: "destructive",
                });
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    handleSponsorChange(index, field, downloadURL);
                    toast({
                        title: "Image Uploaded",
                        description: "The image has been successfully uploaded and the URL is saved.",
                    });
                });
            }
        );
    };

    const addSponsor = () => {
        setSponsors([...sponsors, { name: '', description: '', image: '', pictureUrl: '', website: '', linkedin: '', twitter: '', youtube: '', facebook: '', instagram: '', telegram: '', location: '', mobile: '' }]);
    };

    const removeSponsor = (index: number) => {
        const newSponsors = sponsors.filter((_, i) => i !== index);
        setSponsors(newSponsors);
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
                <h2 className="text-3xl font-bold tracking-tight">Manage Sponsors</h2>
                 <Button onClick={addSponsor} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" /> Add Sponsor
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Event Sponsors</CardTitle>
                    <CardDescription>Add, edit, or remove sponsors from the homepage section.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {sponsors.map((sponsor, index) => (
                        <div key={index} className="space-y-4 p-4 border rounded-lg relative">
                             <Button
                                variant="destructive"
                                size="icon"
                                className="absolute -top-3 -right-3 h-7 w-7"
                                onClick={() => removeSponsor(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`name-${index}`}>Sponsor Name</Label>
                                    <Input id={`name-${index}`} value={sponsor.name} onChange={(e) => handleSponsorChange(index, 'name', e.target.value)} placeholder="Sponsor Company"/>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`image-${index}`}>Logo URL</Label>
                                    <div className="flex items-center gap-2">
                                        <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`image-${index}`} value={sponsor.image} onChange={(e) => handleSponsorChange(index, 'image', e.target.value)} placeholder="https://example.com/logo.png"/>
                                    </div>
                                </div>
                            </div>
                           
                            <div className="space-y-2">
                                <Label htmlFor={`description-${index}`}>Description</Label>
                                <Textarea id={`description-${index}`} value={sponsor.description} onChange={(e) => handleSponsorChange(index, 'description', e.target.value)} placeholder="A short description about the sponsor..."/>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`pictureUrl-${index}`}>Picture URL</Label>
                                <div className="flex items-center gap-2">
                                    <ImageIcon className="h-5 w-5 text-muted-foreground" />
                                    <Input id={`pictureUrl-${index}`} value={sponsor.pictureUrl || ''} onChange={(e) => handleSponsorChange(index, 'pictureUrl', e.target.value)} placeholder="https://example.com/picture.png"/>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor={`image-upload-${index}`}>Upload Logo</Label>
                                <div className="flex items-center gap-2">
                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                    <Input 
                                        id={`image-upload-${index}`} 
                                        type="file" 
                                        accept="image/*"
                                        onChange={(e) => e.target.files && handleImageUpload(index, e.target.files[0], 'image')}
                                        className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                    />
                                </div>
                            </div>
                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`website-${index}`}>Website</Label>
                                     <div className="flex items-center gap-2">
                                        <LinkIcon className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`website-${index}`} value={sponsor.website || ''} onChange={(e) => handleSponsorChange(index, 'website', e.target.value)} placeholder="https://example.com"/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`youtube-${index}`}>YouTube</Label>
                                     <div className="flex items-center gap-2">
                                        <Youtube className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`youtube-${index}`} value={sponsor.youtube || ''} onChange={(e) => handleSponsorChange(index, 'youtube', e.target.value)} placeholder="https://youtube.com/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`facebook-${index}`}>Facebook</Label>
                                     <div className="flex items-center gap-2">
                                        <Facebook className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`facebook-${index}`} value={sponsor.facebook || ''} onChange={(e) => handleSponsorChange(index, 'facebook', e.target.value)} placeholder="https://facebook.com/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`instagram-${index}`}>Instagram</Label>
                                     <div className="flex items-center gap-2">
                                        <Instagram className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`instagram-${index}`} value={sponsor.instagram || ''} onChange={(e) => handleSponsorChange(index, 'instagram', e.target.value)} placeholder="https://instagram.com/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`twitter-${index}`}>Twitter / X</Label>
                                     <div className="flex items-center gap-2">
                                        <Twitter className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`twitter-${index}`} value={sponsor.twitter || ''} onChange={(e) => handleSponsorChange(index, 'twitter', e.target.value)} placeholder="https://twitter.com/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`linkedin-${index}`}>LinkedIn</Label>
                                     <div className="flex items-center gap-2">
                                        <Linkedin className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`linkedin-${index}`} value={sponsor.linkedin || ''} onChange={(e) => handleSponsorChange(index, 'linkedin', e.target.value)} placeholder="https://linkedin.com/company/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`telegram-${index}`}>Telegram</Label>
                                     <div className="flex items-center gap-2">
                                        <Send className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`telegram-${index}`} value={sponsor.telegram || ''} onChange={(e) => handleSponsorChange(index, 'telegram', e.target.value)} placeholder="https://t.me/..."/>
                                    </div>
                                </div>
                                 <div className="space-y-2">
                                    <Label htmlFor={`location-${index}`}>Location (Google Maps URL)</Label>
                                     <div className="flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-muted-foreground" />
                                        <Input id={`location-${index}`} value={sponsor.location || ''} onChange={(e) => handleSponsorChange(index, 'location', e.target.value)} placeholder="https://maps.app.goo.gl/..."/>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`mobile-${index}`}>Mobile No.</Label>
                                     <div className="flex items-center gap-2">
                                        <Phone className="h-5 w-5 text-muted-foreground" />
                                         <div className="flex items-center w-full">
                                            <span className="inline-flex items-center px-3 text-sm text-muted-foreground border border-r-0 border-input rounded-l-md h-10 bg-muted">
                                                +91
                                            </span>
                                            <Input id={`mobile-${index}`} type="tel" value={sponsor.mobile || ''} onChange={(e) => handleSponsorChange(index, 'mobile', e.target.value)} placeholder="1234567890" className="rounded-l-none"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {sponsors.length === 0 && (
                        <p className="text-center text-muted-foreground py-8">No sponsors added yet. Click &quot;Add Sponsor&quot; to start.</p>
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

export default withDynamicImport(SponsorsEditorPage);
