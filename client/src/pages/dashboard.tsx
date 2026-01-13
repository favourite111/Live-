import { useUser, useLogout } from "@/hooks/use-auth";
import { useClasses, useDeleteClass } from "@/hooks/use-classes";
import { CreateClassDialog } from "@/components/CreateClassDialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { format } from "date-fns";
import { useLocation } from "wouter";
import { Loader2, LogOut, Video, Calendar, Clock, Trash2, ExternalLink, ShieldCheck, GraduationCap, BookOpen, Users, MessageSquare, PlayCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

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
          <div className="max-w-4xl mx-auto">
            <div className="text-center py-16 bg-card rounded-2xl border border-border shadow-sm mb-8 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-accent to-primary" />
              <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <GraduationCap className="w-12 h-12 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold mb-2">Ready to start learning?</h3>
              <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                {isTeacher 
                  ? "Your teaching schedule is empty. Create your first class to welcome students." 
                  : "No classes scheduled yet. Check out these resources while you wait."}
              </p>
              
              {isTeacher ? (
                <CreateClassDialog />
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 px-6">
                  {[
                    { label: "Browse Courses", icon: PlayCircle, color: "bg-blue-500", onClick: () => setLocation("/browse-courses") },
                    { label: "Nursing Resources", icon: BookOpen, color: "bg-emerald-500", onClick: () => setLocation("/nursing-resources") },
                    { label: "Meet Teachers", icon: Users, color: "bg-orange-500" },
                    { label: "Community", icon: MessageSquare, color: "bg-pink-500" },
                  ].map((item) => (
                    <Button
                      key={item.label}
                      variant="outline"
                      className="h-auto py-4 flex flex-col gap-2 border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                      onClick={item.onClick}
                    >
                      <div className={`w-10 h-10 rounded-full ${item.color} flex items-center justify-center text-white mb-1 group-hover:scale-110 transition-transform`}>
                        <item.icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold">{item.label}</span>
                    </Button>
                  ))}
                </div>
              )}
            </div>
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
                        <div className="flex items-center gap-2 mt-2">
                          <Avatar className="h-6 w-6 border border-border">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${cls.teacher.username}`} />
                            <AvatarFallback>{cls.teacher.username[0].toUpperCase()}</AvatarFallback>
                          </Avatar>
                          <div className="flex items-center gap-1.5 bg-secondary/50 px-2 py-0.5 rounded-md border border-border/50">
                            <span className="text-xs font-medium text-foreground">{cls.teacher.fullName || cls.teacher.username}</span>
                            <Badge variant="secondary" className="h-4 px-1 text-[10px] bg-primary/10 text-primary border-none">Verified</Badge>
                          </div>
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
                      {(() => {
                        const startTime = new Date(cls.startTime).getTime();
                        const now = new Date().getTime();
                        const diffMinutes = (startTime - now) / (1000 * 60);
                        const isVisible = diffMinutes <= 30 && diffMinutes >= -cls.durationMinutes;

                        if (isVisible || isTeacher) {
                          return (
                            <a 
                              href={cls.meetingLink} 
                              target="_blank" 
                              rel="noreferrer"
                              className="w-full block"
                            >
                              <Button className="w-full bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-all shadow-none hover:shadow-md font-medium border border-primary/20 hover:border-transparent">
                                <Video className="w-4 h-4 mr-2" />
                                {isVisible ? "Join Class" : "View Link"}
                                <ExternalLink className="w-3 h-3 ml-2 opacity-50" />
                              </Button>
                            </a>
                          );
                        }

                        return (
                          <div className="bg-muted/50 rounded-md p-3 text-center text-sm text-muted-foreground border border-border/40">
                            Meeting link visible 30m before start
                          </div>
                        );
                      })()}
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
