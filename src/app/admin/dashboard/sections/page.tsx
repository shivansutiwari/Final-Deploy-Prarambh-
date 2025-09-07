
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
import { withDynamicImport } from '@/components/admin/with-dynamic-import';
import { Separator } from '@/components/ui/separator';

type SectionContent = {
    title: string;
    description: string;
}

type SectionsData = {
    guests: SectionContent;
    schedule: SectionContent;
    highlights: SectionContent;
    gallery: SectionContent;
    sponsors: SectionContent;
    footer: {
        description: string;
        copyright: string;
    }
}

const initialData: SectionsData = {
    guests: { title: '', description: '' },
    schedule: { title: '', description: '' },
    highlights: { title: '', description: '' },
    gallery: { title: '', description: '' },
    sponsors: { title: '', description: '' },
    footer: { description: '', copyright: '' }
};

function SectionsEditorPage() {
    const [sections, setSections] = useState<SectionsData>(initialData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "sections");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    // Merge fetched data with initialData to avoid errors if a field is missing
                    const fetchedData = docSnap.data();
                    setSections(prev => ({
                        ...initialData,
                        ...prev,
                        ...fetchedData,
                        footer: {
                            ...initialData.footer,
                            ...(fetchedData.footer || {})
                        }
                    }));
                }
            } catch (error) {
                console.error("Error fetching sections content:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing section data.",
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
            const docRef = doc(db, "content", "sections");
            await setDoc(docRef, sections, { merge: true });
            toast({
                title: "Section Content Saved!",
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

    const handleInputChange = (section: keyof SectionsData, field: string, value: string) => {
        setSections(prev => {
            const sectionCopy = {...prev[section]};
            (sectionCopy as any)[field] = value;
            return {...prev, [section]: sectionCopy };
        });
    }

    if (pageLoading) {
        return (
            <div className="flex items-center justify-center h-full">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        )
    }
    
    const renderSectionInputs = (sectionKey: keyof Omit<SectionsData, "footer">, sectionTitle: string) => (
        <div key={sectionKey} className="space-y-4">
            <h3 className="text-xl font-semibold tracking-tight">{sectionTitle} Section</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor={`${sectionKey}-title`}>Title</Label>
                    <Input 
                        id={`${sectionKey}-title`} 
                        value={sections[sectionKey]?.title || ''} 
                        onChange={(e) => handleInputChange(sectionKey, 'title', e.target.value)} 
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor={`${sectionKey}-description`}>Description</Label>
                    <Textarea
                        id={`${sectionKey}-description`}
                        value={sections[sectionKey]?.description || ''}
                        onChange={(e) => handleInputChange(sectionKey, 'description', e.target.value)}
                        rows={3}
                     />
                </div>
            </div>
        </div>
    )

    return (
        <div className="p-4 md:p-8 pt-6 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Manage Section Content</h2>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Homepage Section Titles & Descriptions</CardTitle>
                    <CardDescription>Update the text content that appears in the main sections of your website.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-8">
                   {renderSectionInputs("guests", "Guests & Faculty")}
                   <Separator />
                   {renderSectionInputs("schedule", "Schedule")}
                   <Separator />
                   {renderSectionInputs("highlights", "Highlights")}
                   <Separator />
                   {renderSectionInputs("gallery", "Gallery")}
                   <Separator />
                   {renderSectionInputs("sponsors", "Sponsors")}
                   <Separator />
                    <div className="space-y-4">
                        <h3 className="text-xl font-semibold tracking-tight">Footer Section</h3>
                        <div className="space-y-2">
                            <Label htmlFor="footer-description">Description</Label>
                            <Textarea
                                id="footer-description"
                                value={sections.footer?.description || ''}
                                onChange={(e) => handleInputChange("footer", 'description', e.target.value)}
                                rows={2}
                            />
                        </div>
                        <div className="space-y-2">
                             <Label htmlFor="footer-copyright">Copyright Text</Label>
                            <Input
                                id="footer-copyright"
                                value={sections.footer?.copyright || ''}
                                onChange={(e) => handleInputChange("footer", 'copyright', e.target.value)}
                                placeholder={`© ${new Date().getFullYear()} Prarambh BCA. All Rights Reserved.`}
                            />
                        </div>
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

export default withDynamicImport(SectionsEditorPage);
