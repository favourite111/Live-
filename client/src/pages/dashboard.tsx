import { useUser, useLogout } from "@/hooks/use-auth";
import { useClasses, useDeleteClass } from "@/hooks/use-classes";
import { CreateClassDialog } from "@/components/CreateClassDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { Loader2, LogOut, Video, Calendar, Clock, Trash2, ExternalLink, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const { data: classes, isLoading: classesLoading } = useClasses();
  const logout = useLogout();
  const [, setLocation] = useLocation();
  const deleteClass = useDeleteClass();

  // Route protection
  if (!userLoading && !user) {
    setLocation("/auth");
    return null;
  }

  if (userLoading || classesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const isTeacher = user?.role === "teacher";

  return (
    <div className="min-h-screen bg-muted/10">
      {/* Header */}
      <header className="bg-background border-b border-border/50 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold font-display">
              L
            </div>
            <span className="font-display font-bold text-xl text-foreground">LiveClass</span>
          </div>
          
          <div className="flex items-center gap-4">
            {user?.role === "admin" && (
              <Button variant="outline" size="sm" onClick={() => setLocation("/admin")} className="gap-2">
                <ShieldCheck className="w-4 h-4" />
                Admin Console
              </Button>
            )}
            <div className="hidden md:flex flex-col items-end mr-2">
              <span className="text-sm font-semibold text-foreground">{user?.username}</span>
              <span className="text-xs text-muted-foreground capitalize bg-secondary px-2 py-0.5 rounded-full border border-border">
                {user?.role}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={() => logout.mutate()} title="Logout">
              <LogOut className="w-5 h-5 text-muted-foreground hover:text-destructive transition-colors" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">
              {isTeacher ? "My Scheduled Classes" : "Upcoming Classes"}
            </h1>
            <p className="text-muted-foreground mt-1 text-lg">
              {isTeacher 
                ? "Manage your upcoming sessions and teaching schedule." 
                : "Browse and join live learning sessions."}
            </p>
          </div>
          {isTeacher && <CreateClassDialog />}
        </div>

        {classes?.length === 0 ? (
          <div className="text-center py-24 bg-card rounded-2xl border border-dashed border-border shadow-sm">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-medium mb-2">No classes scheduled</h3>
            <p className="text-muted-foreground mb-6">
              {isTeacher ? "Get started by scheduling your first class." : "Check back later for new sessions."}
            </p>
            {isTeacher && <CreateClassDialog />}
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes?.map((cls, idx) => (
              <motion.div
                key={cls.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300 border-border/60 overflow-hidden group bg-card">
                  <div className="h-2 bg-gradient-to-r from-primary to-accent" />
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-4">
                      <div className="space-y-1">
                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors">
                          {cls.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50">
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                            {cls.teacher.username}
                          </span>
                        </div>
                      </div>
                      {isTeacher && user?.id === cls.teacherId && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 -mr-2"
                          onClick={() => {
                            if (confirm("Are you sure you want to cancel this class?")) {
                              deleteClass.mutate(cls.id);
                            }
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <p className="text-muted-foreground text-sm mb-6 line-clamp-2 flex-grow">
                      {cls.description}
                    </p>

                    <div className="space-y-3 pt-4 border-t border-border/40">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4 mr-2 text-primary" />
                        {format(new Date(cls.startTime), "PPP")}
                      </div>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="w-4 h-4 mr-2 text-primary" />
                        {format(new Date(cls.startTime), "p")} • {cls.durationMinutes} mins
                      </div>
                    </div>

                    <div className="mt-6">
                      <a 
                        href={cls.meetingLink} 
                        target="_blank" 
                        rel="noreferrer"
                        className="w-full block"
                      >
                        <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-none hover:shadow-md font-medium border border-primary/20 hover:border-transparent">
                          <Video className="w-4 h-4 mr-2" />
                          Join Class
                          <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                        </Button>
                      </a>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
