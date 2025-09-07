
'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Sidebar, SidebarProvider, SidebarTrigger, SidebarInset, SidebarHeader, SidebarContent, SidebarFooter, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';
import { PrarambhIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Loader2, LayoutDashboard, Link as LinkIcon, LogOut, ExternalLink, LayoutTemplate, Camera, Settings, Megaphone, Users, Star, Crown, Gem, Handshake, MessageSquare, CalendarClock, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import Image from 'next/image';

const ADMIN_UID = "XnJ1ZEC2geTfzFt68u7teyzpHK22";

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const { toast } = useToast();
    const [siteLogo, setSiteLogo] = useState<string | undefined>();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/admin/login');
        } else if (!loading && user && user.uid !== ADMIN_UID) {
            router.push('/');
        }
    }, [user, loading, router]);
    
    useEffect(() => {
        async function fetchLogo() {
            try {
                const docRef = doc(db, "content", "homepage");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().siteLogo) {
                    setSiteLogo(docSnap.data().siteLogo);
                }
            } catch (error) {
                console.error("Error fetching site logo for admin:", error);
            }
        }
        if (user) {
            fetchLogo();
        }
    }, [user]);

    const handleLogout = async () => {
        try {
            await signOut(auth);
            toast({ title: 'Logged Out', description: 'You have been successfully logged out.' });
            router.push('/admin/login');
        } catch (error) {
            toast({ title: 'Logout Failed', description: 'Something went wrong.', variant: 'destructive' });
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    if (!user || user.uid !== ADMIN_UID) {
        return null; // or a redirect component
    }

    const isActive = (path: string) => pathname.startsWith(path) && (pathname === path || pathname.startsWith(path + '/'));


    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <div className="flex items-center gap-2 h-16">
                        {siteLogo ? (
                            <Image src={siteLogo} alt="Logo" width={150} height={50} className="object-contain h-14 invert" />
                        ) : (
                           <>
                            <PrarambhIcon className="h-8 w-8 text-primary" />
                            <span className="font-headline text-lg font-bold">Prarambh Admin</span>
                           </>
                        )}
                    </div>
                </SidebarHeader>
                 <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard') && pathname === '/admin/dashboard'}>
                                <Link href="/admin/dashboard">
                                    <LayoutDashboard />
                                    <span>Dashboard</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/homepage')}>
                                <Link href="/admin/dashboard/homepage">
                                    <LayoutTemplate />
                                    <span>Homepage</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/sections')}>
                                <Link href="/admin/dashboard/sections">
                                    <FileText />
                                    <span>Sections</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/slogans')}>
                                <Link href="/admin/dashboard/slogans">
                                    <Megaphone />
                                    <span>Slogans</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/schedule')}>
                                <Link href="/admin/dashboard/schedule">
                                    <CalendarClock />
                                    <span>Schedule</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/highlights')}>
                                <Link href="/admin/dashboard/highlights">
                                    <Star />
                                    <span>Highlights</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/guests')}>
                                <Link href="/admin/dashboard/guests">
                                    <Users />
                                    <span>Guests</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/sponsors')}>
                                <Link href="/admin/dashboard/sponsors">
                                    <Gem />
                                    <span>Sponsors</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/organizers')}>
                                <Link href="/admin/dashboard/organizers">
                                    <Crown />
                                    <span>Organizers</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/contributors')}>
                                <Link href="/admin/dashboard/contributors">
                                    <Handshake />
                                    <span>Contributors</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/social')}>
                                <Link href="/admin/dashboard/social">
                                    <LinkIcon />
                                    <span>Social Links</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/gallery')}>
                                <Link href="/admin/dashboard/gallery">
                                    <Camera />
                                    <span>Gallery</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/settings')}>
                                <Link href="/admin/dashboard/settings">
                                    <Settings />
                                    <span>Settings</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/warning-slogan')}>
                                <Link href="/admin/dashboard/warning-slogan">
                                    <AlertTriangle />
                                    <span>Login Warning</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild isActive={isActive('/admin/dashboard/security')}>
                                <Link href="/admin/dashboard/security">
                                    <ShieldCheck />
                                    <span>Security</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                 <SidebarFooter>
                    <Button variant="outline" size="sm" asChild>
                         <Link href="/" target="_blank">
                            View Site
                            <ExternalLink className="ml-2 h-4 w-4" />
                        </Link>
                    </Button>
                    <Button variant="destructive" size="sm" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </SidebarFooter>
            </Sidebar>
            <SidebarInset>
                 <div className="md:hidden p-4 flex items-center justify-between border-b">
                     <div className="flex items-center gap-2 h-12">
                        {siteLogo ? (
                             <Image src={siteLogo} alt="Logo" width={120} height={40} className="object-contain h-12 invert" />
                        ) : (
                            <PrarambhIcon className="h-8 w-8 text-primary" />
                        )}
                        <span className="font-headline text-md font-bold">Admin</span>
                    </div>
                    <SidebarTrigger />
                </div>
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return <AdminLayoutContent>{children}</AdminLayoutContent>;
}
