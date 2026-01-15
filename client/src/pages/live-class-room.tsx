import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { 
  LiveKitRoom, 
  VideoConference, 
  RoomAudioRenderer,
} from "@livekit/components-react";
import "@livekit/components-styles";
import { Loader2, ArrowLeft, Users, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/use-auth";
import { Class } from "@shared/schema";

export default function LiveClassRoom() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { data: user } = useUser();
  const [token, setToken] = useState<string | null>(null);

  const { data: cls, isLoading: classLoading } = useQuery<Class>({
    queryKey: [`/api/classes/${id}`],
  });

  useEffect(() => {
    if (cls?.livekitRoomName) {
      fetch(`/api/livekit/token?roomName=${cls.livekitRoomName}`)
        .then(res => res.json())
        .then(data => setToken(data.token))
        .catch(err => console.error("Failed to get LiveKit token", err));
    }
  }, [cls]);

  if (classLoading || !token) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Connecting to classroom...</p>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden">
      <header className="h-16 border-b flex items-center justify-between px-6 bg-card z-10">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => setLocation("/dashboard")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-bold text-lg">{cls?.title}</h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              Live Session • {user?.fullName}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 gap-1.5 py-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live
          </Badge>
        </div>
      </header>

      <main className="flex-1 relative bg-black">
        <LiveKitRoom
          video={user?.role === "teacher"}
          audio={user?.role === "teacher"}
          token={token}
          serverUrl={import.meta.env.VITE_LIVEKIT_URL || `wss://${window.location.host}`}
          options={{
            expConnect: true,
            rtcConfig: {
              iceTransportPolicy: 'relay',
            }
          } as any}
          data-lk-theme="default"
          className="h-full"
          onDisconnected={() => setLocation("/dashboard")}
          onError={(err) => {
            console.error("LiveKit Room Error:", err);
          }}
        >
          <VideoConference />
          <RoomAudioRenderer />
        </LiveKitRoom>
      </main>
    </div>
  );
}

function Badge({ children, className, variant }: any) {
  return (
    <div className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`}>
      {children}
    </div>
  );
}
