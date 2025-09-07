
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getDoc, setDoc, doc } from 'firebase/firestore';
import { updateEmail, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { db, auth } from '@/lib/firebase';
import { Loader2, KeyRound, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { withDynamicImport } from '@/components/admin/with-dynamic-import';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { cn } from "@/lib/utils";
import { Separator } from '@/components/ui/separator';

function SecurityPage() {
    const [securityPassword, setSecurityPassword] = useState('');
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [isWrongPassword, setIsWrongPassword] = useState(false);
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [isWrongCurrentPassword, setIsWrongCurrentPassword] = useState(false);
    const [newEmail, setNewEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [newSecurityPassword, setNewSecurityPassword] = useState('');
    const [confirmNewSecurityPassword, setConfirmNewSecurityPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(true);
    
    const [showSecPass, setShowSecPass] = useState(false);
    const [showCurrentPass, setShowCurrentPass] = useState(false);
    const [showNewPass, setShowNewPass] = useState(false);
    const [showConfirmPass, setShowConfirmPass] = useState(false);
    const [showNewSecPass, setShowNewSecPass] = useState(false);
    const [showConfirmNewSecPass, setShowConfirmNewSecPass] = useState(false);
    
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        async function fetchSecurityPassword() {
            try {
                const docRef = doc(db, "content", "security");
                const docSnap = await getDoc(docRef);
                if (docSnap.exists() && docSnap.data().password) {
                    setSecurityPassword(docSnap.data().password as string);
                }
            } catch (error) {
                console.error("Error fetching security password:", error);
                toast({
                    title: "Error",
                    description: "Could not fetch security settings.",
                    variant: "destructive"
                });
            } finally {
                setPageLoading(false);
            }
        }
        fetchSecurityPassword();
    }, [toast]);
    
    useEffect(() => {
        if (isUnlocked && auth.currentUser) {
            setNewEmail(auth.currentUser.email || '');
        }
    }, [isUnlocked]);

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordInput === securityPassword) {
            setIsUnlocked(true);
            toast({ title: "Access Granted", description: "You can now update your credentials." });
        } else {
            setIsWrongPassword(true);
            setTimeout(() => setIsWrongPassword(false), 820);
            toast({ title: "Access Denied", variant: "destructive" });
        }
    };
    
    const handleSaveSecurityPassword = async () => {
         if (passwordInput.length < 6) {
            toast({ title: "Password Too Short", description: "Security password must be at least 6 characters.", variant: "destructive"});
            return;
        }
        setLoading(true);
        try {
            const docRef = doc(db, "content", "security");
            await setDoc(docRef, { password: passwordInput }, { merge: true });
            setSecurityPassword(passwordInput);
            setIsUnlocked(true);
            toast({ title: "Security Password Set!", description: "You can now update your credentials."});
        } catch (error) {
             toast({ title: "Save Failed", description: "Could not save the new security password.", variant: "destructive"});
        } finally {
            setLoading(false);
        }
    }

    const handleSaveChanges = async () => {
        setIsWrongCurrentPassword(false);
        if (!currentPassword) {
            toast({ title: "Current Password Required", description: "Please enter your current login password to save changes.", variant: "destructive"});
            return;
        }
        if (newPassword && newPassword !== confirmPassword) {
            toast({ title: "New Login Passwords Do Not Match", variant: "destructive" });
            return;
        }
        if (newPassword && newPassword.length < 6) {
            toast({ title: "New Login Password Too Short", description: "Password must be at least 6 characters.", variant: "destructive"});
            return;
        }
         if (newSecurityPassword && newSecurityPassword !== confirmNewSecurityPassword) {
            toast({ title: "New Security Passwords Do Not Match", variant: "destructive" });
            return;
        }
        if (newSecurityPassword && newSecurityPassword.length < 6) {
            toast({ title: "New Security Password Too Short", description: "Security password must be at least 6 characters.", variant: "destructive"});
            return;
        }

        setLoading(true);
        try {
            const user = auth.currentUser;
            if (!user || !user.email) throw new Error("No user logged in or user has no email.");
            
            // Re-authenticate the user
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            await reauthenticateWithCredential(user, credential);
            
            toast({ title: "Re-authentication Successful", description: "Proceeding with updates..." });

            // Proceed with changes
            let emailUpdated = false;
            let passwordUpdated = false;
            let securityPasswordUpdated = false;

            if (newEmail && newEmail !== user.email) {
                await updateEmail(user, newEmail);
                emailUpdated = true;
            }

            if (newPassword) {
                await updatePassword(user, newPassword);
                passwordUpdated = true;
            }

            if (newSecurityPassword) {
                const docRef = doc(db, "content", "security");
                await setDoc(docRef, { password: newSecurityPassword }, { merge: true });
                setSecurityPassword(newSecurityPassword);
                securityPasswordUpdated = true;
            }
            
            if (emailUpdated || passwordUpdated) {
                toast({ title: "Credentials Saved!", description: "Your login credentials have been saved. Please log in again."});
                router.push('/admin/login');
            } else if (securityPasswordUpdated) {
                 toast({ title: "Security Password Updated!", description: "Your changes have been successfully saved."});
                 setNewSecurityPassword('');
                 setConfirmNewSecurityPassword('');
                 setCurrentPassword('');
            } else {
                toast({ title: "No Changes Detected", description: "Your credentials remain the same."});
            }

        } catch (error: any) {
            console.error("Error updating credentials:", error);
            let description = "Could not save your changes.";
            if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
                description = "The current password you entered is incorrect. Please try again.";
                setIsWrongCurrentPassword(true);
                setTimeout(() => setIsWrongCurrentPassword(false), 820);
            } else if (error.code === 'auth/too-many-requests') {
                 description = "Too many failed attempts. Please try again later.";
            }
            toast({
                title: "Save Failed",
                description,
                variant: "destructive"
            });
        } finally {
            setLoading(false);
        }
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
                <h2 className="text-3xl font-bold tracking-tight">Security Settings</h2>
            </div>
            
            {!isUnlocked ? (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><KeyRound/> Secure Area</CardTitle>
                        <CardDescription>
                            {securityPassword ? 
                                "Enter the security password to manage your login credentials." :
                                "Set up a security password to protect your account settings. This will be required to change your email or password."
                            }
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleUnlock}>
                        <CardContent className="space-y-4">
                            <div className="space-y-2 relative">
                                <Label htmlFor="security-password">Security Password</Label>
                                <Input 
                                    id="security-password" 
                                    type={showSecPass ? "text" : "password"}
                                    value={passwordInput} 
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="Enter your security password"
                                    className={cn(isWrongPassword && "border-destructive animate-shake")}
                                />
                                <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowSecPass(!showSecPass)}>
                                    {showSecPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </Button>
                            </div>
                        </CardContent>
                        <CardFooter>
                            {securityPassword ? (
                                <Button type="submit" className={cn(isWrongPassword && "animate-shake")}>Unlock</Button>
                            ) : (
                                <Button onClick={handleSaveSecurityPassword} disabled={loading}>
                                    {loading ? "Saving..." : "Set & Unlock"}
                                </Button>
                            )}
                        </CardFooter>
                    </form>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><ShieldCheck/> Change Credentials</CardTitle>
                        <CardDescription>Update your admin login and security passwords. You must provide your current login password to authorize changes.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                         <div className="space-y-2 relative">
                            <Label htmlFor="currentPassword">Current Login Password (Required to Save)</Label>
                            <Input 
                                id="currentPassword" 
                                type={showCurrentPass ? "text" : "password"} 
                                value={currentPassword} 
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="Enter your current login password"
                                className={cn(isWrongCurrentPassword && "border-destructive animate-shake")}
                            />
                             <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowCurrentPass(!showCurrentPass)}>
                                {showCurrentPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        <Separator />
                        <div className="space-y-2">
                            <Label htmlFor="email">Admin Login Email</Label>
                            <Input id="email" type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} />
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="newPassword">New Login Password (leave blank to keep current)</Label>
                            <Input 
                                id="newPassword" 
                                type={showNewPass ? "text" : "password"} 
                                value={newPassword} 
                                onChange={(e) => setNewPassword(e.target.value)} 
                            />
                             <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowNewPass(!showNewPass)}>
                                {showNewPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="confirmPassword">Confirm New Login Password</Label>
                            <Input 
                                id="confirmPassword" 
                                type={showConfirmPass ? "text" : "password"} 
                                value={confirmPassword} 
                                onChange={(e) => setConfirmPassword(e.target.value)} 
                            />
                             <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirmPass(!showConfirmPass)}>
                                {showConfirmPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        <Separator />
                         <div className="space-y-2 relative">
                            <Label htmlFor="newSecurityPassword">New Security Password (leave blank to keep current)</Label>
                            <Input 
                                id="newSecurityPassword" 
                                type={showNewSecPass ? "text" : "password"} 
                                value={newSecurityPassword} 
                                onChange={(e) => setNewSecurityPassword(e.target.value)} 
                            />
                             <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowNewSecPass(!showNewSecPass)}>
                                {showNewSecPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                        <div className="space-y-2 relative">
                            <Label htmlFor="confirmNewSecurityPassword">Confirm New Security Password</Label>
                            <Input 
                                id="confirmNewSecurityPassword" 
                                type={showConfirmNewSecPass ? "text" : "password"} 
                                value={confirmNewSecurityPassword} 
                                onChange={(e) => setConfirmNewSecurityPassword(e.target.value)} 
                            />
                             <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-7 h-7 w-7 text-muted-foreground" onClick={() => setShowConfirmNewSecPass(!showConfirmNewSecPass)}>
                                {showConfirmNewSecPass ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                            </Button>
                        </div>
                         <Alert>
                            <ShieldCheck className="h-4 w-4" />
                            <AlertTitle>Security Note</AlertTitle>
                            <AlertDescription>
                              For security reasons, changing your credentials requires you to re-authenticate by entering your current login password.
                            </AlertDescription>
                        </Alert>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={handleSaveChanges} disabled={loading}>
                            {loading ? "Saving..." : "Save Changes"}
                        </Button>
                    </CardFooter>
                </Card>
            )}
        </div>
    )
}

export default withDynamicImport(SecurityPage);
