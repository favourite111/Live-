import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, MessageSquare, Award, Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { User } from "@shared/schema";

export default function MeetTeachers() {
  const [, setLocation] = useLocation();
  const { data: teachers, isLoading } = useQuery<User[]>({
    queryKey: ["/api/teachers"]
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/30 pb-12">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto w-full flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold font-display">Our Educators</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold font-display mb-3">Meet Your Mentors</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Learn from industry experts with decades of clinical experience. Our teachers are here to guide your nursing journey.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {(!teachers || teachers.length === 0) ? (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No teachers registered yet.</p>
            </div>
          ) : (
            teachers.map((teacher, idx) => (
              <motion.div
                key={teacher.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-border/60 group bg-card h-full">
                  <div className="p-6 flex flex-col md:flex-row gap-6">
                    <div className="flex flex-col items-center gap-3">
                      <Avatar className="h-24 w-24 border-2 border-primary/20 ring-4 ring-background shadow-md">
                        <AvatarImage src={teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${teacher.username}`} alt={teacher.fullName} />
                        <AvatarFallback>{teacher.fullName[0]}</AvatarFallback>
                      </Avatar>
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="text-xl font-bold font-display text-foreground">{teacher.fullName}</h3>
                            <Badge variant="secondary" className="h-5 px-1.5 text-[10px] bg-primary/10 text-primary border-none">
                              Verified Expert
                            </Badge>
                          </div>
                          <p className="text-primary font-medium text-sm">{teacher.specialty || "Instructor"}</p>
                        </div>
                      </div>

                      <p className="text-muted-foreground text-sm leading-relaxed italic">
                        {teacher.bio ? `"${teacher.bio}"` : "No bio provided yet."}
                      </p>

                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Award className="w-3.5 h-3.5 text-primary" />
                          <span>{teacher.specialty || "General Nursing"}</span>
                        </div>
                      </div>

                      <div className="pt-4 flex gap-2">
                        <Button size="sm" className="flex-1 gap-2">
                          <MessageSquare className="w-3.5 h-3.5" />
                          Send Message
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
