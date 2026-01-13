import { useUser } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { User } from "@shared/schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2, ShieldCheck, UserCheck, UserX, AlertCircle } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function AdminDashboard() {
  const { data: user, isLoading: userLoading } = useUser();
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
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

  if (userLoading || (user && user.role !== "admin" && !userLoading)) {
    if (user && user.role !== "admin") {
      setLocation("/dashboard");
      return null;
    }
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    setLocation("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <ShieldCheck className="w-8 h-8 text-primary" />
              Admin Console
            </h1>
            <p className="text-muted-foreground mt-2">
              Manage users and their application status.
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
          </CardHeader>
          <CardContent>
            {usersLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin" />
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u) => (
                    <TableRow key={u.id}>
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-semibold">{u.fullName}</div>
                          <div className="text-xs text-muted-foreground">@{u.username}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">
                          {u.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{u.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            u.status === "active"
                              ? "default"
                              : u.status === "pending"
                              ? "secondary"
                              : "destructive"
                          }
                          className="capitalize"
                        >
                          {u.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {u.status !== "active" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1"
                              onClick={() =>
                                updateStatusMutation.mutate({ id: u.id, status: "active" })
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserCheck className="w-4 h-4" />
                              Approve
                            </Button>
                          )}
                          {u.status !== "suspended" && u.role !== "admin" && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-8 gap-1 text-destructive hover:text-destructive"
                              onClick={() =>
                                updateStatusMutation.mutate({ id: u.id, status: "suspended" })
                              }
                              disabled={updateStatusMutation.isPending}
                            >
                              <UserX className="w-4 h-4" />
                              Suspend
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
