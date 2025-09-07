
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Home, Link2, Settings, LayoutTemplate, Camera, CalendarClock, Megaphone, Users, Star, Crown, Gem, Handshake, MessageSquare, AlertTriangle, ShieldCheck, FileText } from "lucide-react";

export default function AdminDashboardPage() {

  return (
    <div className="p-4 md:p-8 pt-6 space-y-4">
        <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Homepage
                    </CardTitle>
                    <LayoutTemplate className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                        Customize hero text, logos, and year.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/homepage">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Section Content
                    </CardTitle>
                    <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                        Edit titles & descriptions for sections.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/sections">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Slogans
                    </CardTitle>
                    <Megaphone className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Edit the scrolling slogans at the top.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/slogans">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Schedule
                    </CardTitle>
                    <CalendarClock className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Edit the event's timeline and items.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/schedule">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Highlights
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Edit the event highlight cards.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/highlights">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Guests & Faculty
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Manage the honored guests section.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/guests">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Sponsors
                    </CardTitle>
                    <Gem className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Manage the event sponsors.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/sponsors">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Organizers
                    </CardTitle>
                    <Crown className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Manage the Wall of Fame names.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/organizers">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Contributors
                    </CardTitle>
                    <Handshake className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Manage the Wall of Contributors.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/contributors">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Social Media
                    </CardTitle>
                    <Link2 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Update your social media links.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/social">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Gallery
                    </CardTitle>
                    <Camera className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                       Manage the event photo gallery link.
                    </p>
                    <Button asChild size="sm">
                        <Link href="/admin/dashboard/gallery">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Event Settings
                    </CardTitle>
                    <Settings className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                        Manage event date, time, and venue.
                    </p>
                     <Button asChild size="sm">
                        <Link href="/admin/dashboard/settings">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Login Warning
                    </CardTitle>
                    <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                        Set warning for failed login attempts.
                    </p>
                     <Button asChild size="sm">
                        <Link href="/admin/dashboard/warning-slogan">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
             <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Security
                    </CardTitle>
                    <ShieldCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <p className="text-xs text-muted-foreground mb-4">
                        Change your admin email and password.
                    </p>
                     <Button asChild size="sm">
                        <Link href="/admin/dashboard/security">Manage</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    </div>
  );
}
