import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2, ArrowLeft, Mail, Lock } from "lucide-react";

const forgotSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const resetSchema = z.object({
  otp: z.string().length(6, "Code must be 6 digits"),
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
});

export default function ForgotPassword() {
  const [step, setStep] = useState<"forgot" | "reset">("forgot");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const forgotForm = useForm<z.infer<typeof forgotSchema>>({
    resolver: zodResolver(forgotSchema),
    defaultValues: { email: "" },
  });

  const resetForm = useForm<z.infer<typeof resetSchema>>({
    resolver: zodResolver(resetSchema),
    defaultValues: { otp: "", newPassword: "" },
  });

  async function onForgotSubmit(data: z.infer<typeof forgotSchema>) {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/forgot-password", data);
      setEmail(data.email);
      setStep("reset");
      toast({ title: "Check your email", description: "We've sent a 6-digit reset code." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  async function onResetSubmit(data: z.infer<typeof resetSchema>) {
    setIsLoading(true);
    try {
      await apiRequest("POST", "/api/auth/reset-password", { ...data, email });
      toast({ title: "Success", description: "Your password has been reset." });
      setLocation("/auth");
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-fit -ml-2 mb-2 gap-1 text-muted-foreground"
            onClick={() => step === "reset" ? setStep("forgot") : setLocation("/auth")}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>
          <CardTitle className="text-2xl font-bold">
            {step === "forgot" ? "Forgot Password" : "Reset Password"}
          </CardTitle>
          <CardDescription>
            {step === "forgot" 
              ? "Enter your email and we'll send you a code to reset your password."
              : `Enter the 6-digit code sent to ${email}`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {step === "forgot" ? (
            <Form {...forgotForm}>
              <form onSubmit={forgotForm.handleSubmit(onForgotSubmit)} className="space-y-4">
                <FormField
                  control={forgotForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input className="pl-9" placeholder="you@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Send Reset Code
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...resetForm}>
              <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
                <FormField
                  control={resetForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Reset Code</FormLabel>
                      <FormControl>
                        <Input placeholder="123456" maxLength={6} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={resetForm.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
                          <Input type="password" className="pl-9" placeholder="••••••••" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Reset Password
                </Button>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
