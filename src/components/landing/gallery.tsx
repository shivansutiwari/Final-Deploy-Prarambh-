
"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Camera, KeyRound, ShieldAlert, Folder, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { Skeleton } from "../ui/skeleton";

type GalleryAlbum = {
    name: string;
    link: string;
};

type GalleryData = {
    password?: string;
    qrPassToken?: string;
    albums?: GalleryAlbum[];
    driveLinks?: string[]; // For backward compatibility
};

type SectionContent = {
    title: string;
    description: string;
};

const defaultContent = {
    title: "Event Gallery",
    description: "A collection of moments from Prarambh BCA. Access the albums to relive the memories."
};

function GallerySkeleton() {
  return (
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
        <Skeleton className="h-6 w-2/3 mx-auto" />
      </div>
      <div className="flex justify-center">
        <Skeleton className="h-16 w-64 rounded-full" />
      </div>
    </div>
  );
}

function GalleryComponent({ gallery: serverGallery, content, loading }: { gallery?: GalleryData, content?: SectionContent, loading?: boolean }) {
  const { password, qrPassToken, albums: serverAlbums, driveLinks } = serverGallery || {};
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const { title, description } = content || defaultContent;
  
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");
  const [isWrongPassword, setIsWrongPassword] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Process albums for backward compatibility
  const albums: GalleryAlbum[] = serverAlbums && serverAlbums.length > 0 
    ? serverAlbums
    : (driveLinks || []).map((link, index) => ({ name: `Album ${index + 1}`, link }));

  useEffect(() => {
    const vipPass = searchParams.get('vip_pass');
    if (vipPass && qrPassToken && vipPass === qrPassToken) {
      setIsUnlocked(true);
       toast({
          title: "VIP Access Granted",
          description: "The photo gallery is unlocked.",
      });
    }
  }, [searchParams, qrPassToken, toast]);


  const hasContent = albums && albums.length > 0 && albums.some(a => a.link.trim() !== '');

  const handleGalleryClick = () => {
    if (!hasContent) {
        toast({
            title: "Gallery Not Available",
            description: "The gallery albums haven't been set up yet.",
            variant: "destructive"
        });
        return;
    }
    
    // If unlocked by VIP pass or no password is set at all (password is empty string)
    if (isUnlocked || !password) {
        setIsFolderModalOpen(true);
    } else { // Otherwise, ask for password
        setIsPasswordModalOpen(true);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password && passwordInput === password) {
        setIsPasswordModalOpen(false);
        setPasswordInput("");
        setIsUnlocked(true); // Unlock for the session
        setIsFolderModalOpen(true);
    } else {
        setIsWrongPassword(true);
        setTimeout(() => setIsWrongPassword(false), 820);
    }
  }

  const handlePasswordModalOpenChange = (isOpen: boolean) => {
    setIsPasswordModalOpen(isOpen);
    if (!isOpen) {
      setPasswordInput("");
      setIsWrongPassword(false);
    }
  }

  return (
    <section id="gallery">
      {loading ? (
        <GallerySkeleton />
      ) : (
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-headline text-4xl md:text-5xl font-bold">{title}</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex justify-center">
              {hasContent ? (
                  <Button onClick={handleGalleryClick} size="lg" className="text-lg py-6 px-10 rounded-full font-bold shadow-xl transition-transform hover:scale-105">
                      <Camera className="mr-3 h-6 w-6"/>
                      View Photo Albums
                  </Button>
              ) : (
                  <Button size="lg" className="text-lg py-6 px-10 rounded-full font-bold bg-primary text-primary-foreground opacity-75 cursor-not-allowed" disabled>
                      <Camera className="mr-3 h-6 w-6"/>
                      Coming Soon
                  </Button>
              )}
          </div>
        </div>
      )}

       {/* Password Modal */}
       <Dialog open={isPasswordModalOpen} onOpenChange={handlePasswordModalOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
                <KeyRound className="w-6 h-6 text-primary"/>
                VIP Gallery Access
            </DialogTitle>
            <DialogDescription>
              This gallery is password protected. Please enter the VIP pass to view the photo albums.
            </DialogDescription>
          </DialogHeader>
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
               <div className="relative">
                 <Input 
                    id="password"
                    type="password"
                    placeholder="Enter VIP Pass"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className={cn(
                        "transition-all", 
                        isWrongPassword ? "border-destructive focus-visible:ring-destructive" : ""
                    )}
                 />
                 {isWrongPassword && <ShieldAlert className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-destructive"/>}
               </div>
                <Button type="submit" className={cn("w-full", isWrongPassword && "animate-shake")}>
                    Unlock Gallery
                </Button>
            </form>
        </DialogContent>
      </Dialog>
      
      {/* Folder Selection Modal */}
      <Dialog open={isFolderModalOpen} onOpenChange={setIsFolderModalOpen}>
        <DialogContent className="max-w-lg">
           <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-headline">
                <Folder className="w-6 h-6 text-primary"/>
                Photo Albums
            </DialogTitle>
            <DialogDescription>
              Select an album to view the photos. Each will open in a new tab.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 max-h-[60vh] overflow-y-auto">
             {albums?.map((album, index) => (
                <a href={album.link} target="_blank" rel="noopener noreferrer" key={index} className="p-4 bg-card rounded-lg border border-border/50 text-left hover:bg-accent/10 hover:-translate-y-1 transition-all duration-300 flex flex-col items-start w-full group">
                  <div className="p-3 bg-accent/10 rounded-full mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                     <Folder className="h-6 w-6 text-accent group-hover:text-accent-foreground transition-colors"/>
                  </div>
                  <h3 className="font-headline text-lg font-bold flex-grow">{album.name}</h3>
                  <div className="flex items-center text-sm text-primary mt-2">
                    <ExternalLink className="mr-2 h-4 w-4"/>
                    <span>Open Album</span>
                  </div>
                </a>
             ))}
          </div>
           <DialogFooter>
             <DialogClose asChild>
                <Button variant="outline">Close</Button>
            </DialogClose>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// Suspense Boundary is required for useSearchParams to work during server-side rendering
export function Gallery(props: { gallery?: GalleryData, content?: SectionContent, loading?: boolean }) {
  return (
    <Suspense fallback={<GallerySkeleton />}>
      <GalleryComponent {...props} />
    </Suspense>
  )
}
