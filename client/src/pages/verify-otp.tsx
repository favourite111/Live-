import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function VerifyOtp() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const verifyMutation = useMutation({
    mutationFn: async () => {
      const res = await fetch(api.auth.verifyOtp.path, {
        method: api.auth.verifyOtp.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
        credentials: "include",
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Verification failed");
      }
      return api.auth.verifyOtp.responses[200].parse(await res.json());
    },
    onSuccess: (user) => {
      toast({ title: "Email verified", description: "You are now logged in." });
      setLocation("/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Verification Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-xl border-border/60">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-display">Verify Email</CardTitle>
          <CardDescription>
            Enter the OTP sent to your email address to continue.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Confirm your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="otp">One-Time Password (OTP)</Label>
            <Input
              id="otp"
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <Button 
            className="w-full mt-2" 
            onClick={() => verifyMutation.mutate()}
            disabled={verifyMutation.isPending || !email || !otp}
          >
            {verifyMutation.isPending && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            Verify Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
