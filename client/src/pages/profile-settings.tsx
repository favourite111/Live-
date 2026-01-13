import { useUser } from "@/hooks/use-auth";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, User } from "@shared/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { ArrowLeft, Loader2, User as UserIcon, Upload, X } from "lucide-react";
import { z } from "zod";
import { useState } from "react";

const profileSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  bio: z.string().max(500, "Bio must be under 500 characters").optional(),
  specialty: z.string().min(2, "Specialty is required").optional(),
  avatar: z.string().optional().or(z.string().length(0)),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function ProfileSettings() {
  const { data: user, isLoading: userLoading } = useUser();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user?.avatar || null);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: user?.fullName || "",
      bio: user?.bio || "",
      specialty: user?.specialty || "",
      avatar: user?.avatar || "",
    },
  });

  if (userLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 1024 * 1024) { // 1MB limit for base64
        toast({
          title: "File too large",
          description: "Please upload an image smaller than 1MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setAvatarPreview(base64String);
        form.setValue("avatar", base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  async function onSubmit(values: ProfileFormValues) {
    try {
      await apiRequest("PATCH", `/api/users/${user?.id}`, values);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your professional profile has been saved successfully.",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto w-full flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display text-foreground">Profile Settings</h1>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl font-display font-bold">Your Professional Profile</CardTitle>
            <CardDescription>
              This information will be displayed on the "Meet Our Teachers" page.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Dr. Jane Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="specialty"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Specialty</FormLabel>
                      <FormControl>
                        <Input placeholder="Critical Care Nursing / Anatomy" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Tell students about your clinical experience and teaching style..." 
                          className="min-h-[120px] resize-none"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="avatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo</FormLabel>
                      <FormControl>
                        <div className="flex flex-col gap-4">
                          {avatarPreview ? (
                            <div className="relative w-32 h-32 group">
                              <img 
                                src={avatarPreview} 
                                alt="Profile Preview" 
                                className="w-full h-full object-cover rounded-lg border-2 border-border"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setAvatarPreview(null);
                                  form.setValue("avatar", "");
                                }}
                                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-border hover:border-primary/50 transition-colors cursor-pointer relative bg-muted/50 group">
                              <Input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                              />
                              <div className="flex flex-col items-center gap-2 text-muted-foreground group-hover:text-primary transition-colors text-center p-2">
                                <Upload className="w-6 h-6" />
                                <span className="text-[10px] font-medium">Upload Image (Max 1MB)</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="pt-4 flex gap-3">
                  <Button type="submit" className="flex-1 font-semibold h-11">
                    Save Changes
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="flex-1 h-11"
                    onClick={() => setLocation("/dashboard")}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
