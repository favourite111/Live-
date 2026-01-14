import { useUser } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User, Class } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, UserCheck, UserX, Trash2, ArrowLeft, GraduationCap, Users, Video, Clock, BarChart3, Calendar } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import { format } from "date-fns";

export default function AdminDashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!user && user.role === "admin",
  });

  const { data: classes, isLoading: classesLoading } = useQuery<Class[]>({
    queryKey: ["/api/classes"],
    enabled: !!user && user.role === "admin",
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number; status: string }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}/status`, { status });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Success", description: "User status updated successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/admin/users/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({ title: "Deleted", description: "User has been removed permanently" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  if (userLoading || usersLoading || classesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    setLocation("/dashboard");
    return null;
  }

  const studentsCount = users?.filter((u) => u.role === "student").length || 0;
  const teachersCount = users?.filter((u) => u.role === "teacher").length || 0;
  const pendingUsersCount = users?.filter((u) => u.status === "pending").length || 0;

  return (
    <div className="min-h-screen bg-muted/20 pb-12">
      <header className="bg-background border-b h-16 flex items-center px-4 sm:px-6 lg:px-8 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-xl font-bold font-display flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              Admin Console
            </h1>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary/5 text-primary border-primary/20 hover:bg-primary/10 transition-colors gap-2"
            onClick={() => toast({ title: "Coming Soon", description: "Detailed platform reports will be available here soon." })}
          >
            <BarChart3 className="w-4 h-4" />
            Platform Overview
          </Button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/60 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                  <h3 className="text-3xl font-bold font-display mt-1">{studentsCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-blue-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Registered Teachers</p>
                  <h3 className="text-3xl font-bold font-display mt-1">{teachersCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                  <Users className="w-6 h-6 text-orange-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Live Classes</p>
                  <h3 className="text-3xl font-bold font-display mt-1">{classes?.length || 0}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <Video className="w-6 h-6 text-emerald-500" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/60 hover:shadow-md transition-all">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                  <h3 className="text-3xl font-bold font-display mt-1">{pendingUsersCount}</h3>
                </div>
                <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-500" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Management */}
          <Card className="lg:col-span-2 border-border/60">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="font-display">User Management</CardTitle>
                <CardDescription>Manage permissions and access for all users.</CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium text-foreground">{u.fullName}</span>
                          <span className="text-xs text-muted-foreground">{u.email}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={u.status === 'active' ? 'default' : u.status === 'pending' ? 'secondary' : 'destructive'}
                          className="capitalize"
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {u.status !== 'active' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 gap-1 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50"
                              onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'active' })}
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              Approve
                            </Button>
                          )}
                          {u.status === 'active' && u.role !== 'admin' && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="h-8 gap-1 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
                              onClick={() => updateStatusMutation.mutate({ id: u.id, status: 'suspended' })}
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserX className="w-3.5 h-3.5" />
                              Suspend
                            </Button>
                          )}
                          {u.role !== 'admin' && (
                            <Button 
                              size="sm" 
                              variant="ghost" 
                              className="h-8 w-8 text-muted-foreground hover:text-destructive p-0"
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete ${u.fullName} permanently?`)) {
                                  deleteUserMutation.mutate(u.id);
                                }
                              }}
                              disabled={deleteUserMutation.isPending}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {/* Recent Class Activity */}
          <Card className="border-border/60">
            <CardHeader>
              <CardTitle className="font-display">Recent Activity</CardTitle>
              <CardDescription>Latest classes scheduled on the platform.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {classes?.slice(0, 5).map((cls) => (
                  <div key={cls.id} className="flex gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-semibold text-foreground line-clamp-1">{cls.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(cls.startTime), "MMM d, h:mm a")}
                      </p>
                      <Badge variant="secondary" className="text-[10px] h-4 px-1">
                        {cls.durationMinutes} mins
                      </Badge>
                    </div>
                  </div>
                ))}
                {(!classes || classes.length === 0) && (
                  <p className="text-center text-sm text-muted-foreground py-8 italic">
                    No classes scheduled yet.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
