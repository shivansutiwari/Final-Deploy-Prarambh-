
"use client";

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Loader2, Link as LinkIcon, KeyRound, PlusCircle, Trash2, QrCode, Download, Folder, RefreshCw } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';
import QRCode from 'qrcode.react';

type GalleryAlbum = {
    name: string;
    link: string;
};

type GalleryData = {
    password?: string;
    qrPassToken?: string;
    albums: GalleryAlbum[];
};

const initialGalleryData: GalleryData = {
    password: '',
    qrPassToken: '',
    albums: [{ name: '', link: '' }]
};

function GalleryEditorPage() {
    const [galleryData, setGalleryData] = useState<GalleryData>(initialGalleryData);
    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    const [baseUrl, setBaseUrl] = useState('');
    const { toast } = useToast();
    const router = useRouter();
    const qrCodeRef = useRef<HTMLDivElement>(null);

     // Function to generate a random token
    const generateToken = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

    useEffect(() => {
        // Ensure this runs only on the client
        setBaseUrl(window.location.origin);

        async function fetchContent() {
            try {
                const docRef = doc(db, "content", "gallery");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data()) {
                    const data = docSnap.data() as Partial<GalleryData & { driveLinks?: string[] }>;
                    
                    let albums: GalleryAlbum[] = [];
                    if (data.albums && data.albums.length > 0) {
                        albums = data.albums;
                    } 
                    else if (data.driveLinks && data.driveLinks.length > 0) {
                        albums = data.driveLinks.map((link, index) => ({ name: `Album ${index + 1}`, link }));
                    }

                    if (albums.length === 0) {
                        albums.push({ name: '', link: '' });
                    }

                    setGalleryData({
                        password: data.password || '',
                        qrPassToken: data.qrPassToken || generateToken(),
                        albums: albums
                    });
                } else {
                    // If no doc, generate initial token
                    setGalleryData(prev => ({...prev, qrPassToken: generateToken()}));
                }
            } catch (error) {
                console.error("Error fetching gallery content:", error);
                toast({
                    title: "Error fetching content",
                    description: "Could not load existing gallery data.",
                    variant: "destructive"
                });
            } finally {
                setPageLoading(false);
            }
        }
        fetchContent();
    }, [toast]);

    const handleGenerateNewQrPass = () => {
        const newToken = generateToken();
        setGalleryData(prev => ({...prev, qrPassToken: newToken}));
        toast({
            title: "New QR Pass Generated",
            description: "A new unique QR code has been created. Don't forget to save your changes.",
        });
    }

    const handleSave = async () => {
        setLoading(true);
        try {
            const docRef = doc(db, "content", "gallery");
            const validAlbums = galleryData.albums.filter(album => album.link.trim() !== '' || album.name.trim() !== '');
            const dataToSave = { 
                password: galleryData.password || '',
                qrPassToken: galleryData.qrPassToken || '',
                albums: validAlbums 
            };
            await setDoc(docRef, dataToSave);
            toast({
                title: "Gallery Settings Saved!",
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

    const handleAlbumChange = (index: number, field: keyof GalleryAlbum, value: string) => {
        const newAlbums = [...galleryData.albums];
        newAlbums[index] = {...newAlbums[index], [field]: value};
        setGalleryData({...galleryData, albums: newAlbums});
    };

    const addAlbum = () => {
        setGalleryData(prev => ({...prev, albums: [...prev.albums, {name: '', link: ''}]}));
    };

    const removeAlbum = (index: number) => {
        const newAlbums = galleryData.albums.filter((_, i) => i !== index);
        setGalleryData({...galleryData, albums: newAlbums});
    };

     const downloadQRCode = () => {
        const qrCodeCanvas = qrCodeRef.current?.querySelector('canvas');
        if (qrCodeCanvas) {
            const pngUrl = qrCodeCanvas
                .toDataURL("image/png")
                .replace("image/png", "image/octet-stream");
            let downloadLink = document.createElement("a");
            downloadLink.href = pngUrl;
            downloadLink.download = "prarambh-gallery-vip-pass.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
             toast({
                title: "QR Code Downloading...",
                description: "Check your downloads folder.",
            });
        } else {
             toast({
                title: "Download Failed",
                description: "Could not find the QR code to download.",
                variant: "destructive"
            });
        }
    };

    const qrCodeUrl = galleryData.qrPassToken ? `${baseUrl}/?vip_pass=${encodeURIComponent(galleryData.qrPassToken)}` : baseUrl;


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
                <h2 className="text-3xl font-bold tracking-tight">Manage Gallery</h2>
            </div>

            <Card>
                 <CardHeader>
                    <CardTitle>Event Gallery Settings</CardTitle>
                    <CardDescription>Set a password for manual entry and manage a separate QR code for quick access.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-4 p-4 border rounded-lg flex flex-col">
                            <div className="space-y-2">
                                <Label htmlFor="password">Access Password</Label>
                                <div className="flex items-center gap-2">
                                   <KeyRound className="h-5 w-5 text-muted-foreground" />
                                   <Input 
                                        id="password" 
                                        type="text" 
                                        value={galleryData.password || ''} 
                                        onChange={(e) => setGalleryData({...galleryData, password: e.target.value})} 
                                        placeholder="e.g., prarambh-vip-2025"
                                    />
                                </div>
                                <p className="text-xs text-muted-foreground pt-1 flex-grow">This password allows manual access. Leave blank for no password.</p>
                            </div>
                            
                            <div className="mt-4 border-t pt-4">
                                 <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                                    <div>
                                        <h4 className="font-semibold flex items-center gap-2"><QrCode/> QR Code for VIP Pass</h4>
                                        <p className="text-xs text-muted-foreground">Scan for password-less access. Regenerate if leaked.</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="secondary" onClick={handleGenerateNewQrPass}>
                                            <RefreshCw className="mr-2 h-4 w-4"/>
                                            New QR
                                        </Button>
                                        <Button size="sm" variant="outline" onClick={downloadQRCode}>
                                            <Download className="mr-2 h-4 w-4"/>
                                            Download
                                        </Button>
                                    </div>
                                </div>
                                <div ref={qrCodeRef} className="p-4 bg-white rounded-md w-fit mx-auto">
                                    <QRCode 
                                        value={qrCodeUrl}
                                        size={160}
                                        level="H"
                                        includeMargin={true}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4 p-4 border rounded-lg">
                            <div className="flex items-center justify-between">
                                <div>
                                    <Label className="text-base font-medium">Photo Albums</Label>
                                    <p className="text-sm text-muted-foreground">Add named links to your public Google Drive folders.</p>
                                </div>
                                <Button onClick={addAlbum} size="sm">
                                    <PlusCircle className="mr-2 h-4 w-4" /> Add Album
                                </Button>
                            </div>

                            {galleryData.albums.map((album, index) => (
                                 <div key={index} className="flex items-start gap-2 border-b pb-4 last:border-b-0">
                                    <div className="flex-grow space-y-2">
                                        <div className="flex items-center gap-2">
                                            <Folder className="h-5 w-5 text-muted-foreground" />
                                            <Input 
                                                value={album.name} 
                                                onChange={(e) => handleAlbumChange(index, 'name', e.target.value)} 
                                                placeholder="e.g., Event Photos"
                                            />
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <LinkIcon className="h-5 w-5 text-muted-foreground" />
                                            <Input 
                                                value={album.link} 
                                                onChange={(e) => handleAlbumChange(index, 'link', e.target.value)} 
                                                placeholder="https://drive.google.com/drive/folders/..."
                                            />
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="mt-1 flex-shrink-0"
                                        onClick={() => removeAlbum(index)}
                                        disabled={galleryData.albums.length <= 1 && album.link.trim() === '' && album.name.trim() === ''}
                                    >
                                        <Trash2 className="h-4 w-4 text-destructive" />
                                    </Button>
                                </div>
                            ))}
                             <p className="text-xs text-muted-foreground pt-2">Make sure each folder is set to 'Anyone with the link can view'.</p>
                             {galleryData.albums.length === 0 && (
                                <p className="text-center text-muted-foreground py-4">No albums added yet. Click &quot;Add Album&quot; to start.</p>
                            )}
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

export default withDynamicImport(GalleryEditorPage);
