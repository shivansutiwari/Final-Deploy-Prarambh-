
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { PrarambhIcon } from "@/components/icons";
import { auth, db } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';
import Image from "next/image";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

export default function AdminLoginPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [siteLogo, setSiteLogo] = useState<string | undefined>();
  const [warningSlogan, setWarningSlogan] = useState<string | null>(null);
  const [showWarning, setShowWarning] = useState(false);
  const [showPassword, setShowPassword] = useState(false);


  useEffect(() => {
    async function fetchContent() {
        try {
            const homepageDocRef = doc(db, "content", "homepage");
            const homepageDocSnap = await getDoc(homepageDocRef);
            if (homepageDocSnap.exists() && homepageDocSnap.data().siteLogo) {
                setSiteLogo(homepageDocSnap.data().siteLogo);
            }

            const warningDocRef = doc(db, "content", "login_warning");
            const warningDocSnap = await getDoc(warningDocRef);
            if (warningDocSnap.exists() && warningDocSnap.data().slogan) {
                setWarningSlogan(warningDocSnap.data().slogan);
            }

        } catch (error) {
            console.error("Error fetching page content for login:", error);
        }
    }
    fetchContent();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setShowWarning(false);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login Successful",
        description: "Redirecting to the dashboard...",
      });
      router.push("/admin/dashboard");
    } catch (error: any) {
       toast({
        title: "Login Failed",
        description: "Invalid email or password.",
        variant: "destructive",
      });
      setShowWarning(true);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
            <div className="flex justify-center items-center gap-4 mb-4 h-24">
                {siteLogo ? (
                    <Image src={siteLogo} alt="Prarambh Logo" width={300} height={100} className="object-contain h-24 invert" />
                ) : (
                    <>
                        <PrarambhIcon className="h-24 w-24 text-primary" />
                        <CardTitle className="font-headline text-5xl">Prarambh Admin</CardTitle>
                    </>
                )}
            </div>
          <CardDescription>Enter your credentials to access the dashboard.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            <div className="space-y-2 relative">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pr-10"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-7 h-7 w-7 text-muted-foreground hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
              </Button>
            </div>
             {showWarning && warningSlogan && (
                <Alert variant="destructive" className={cn("animate-shake")}>
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription className="font-bold">
                        {warningSlogan}
                    </AlertDescription>
                </Alert>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Log In"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
