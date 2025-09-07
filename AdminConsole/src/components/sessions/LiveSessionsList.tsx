import { Clock, MapPin, Users, Phone, Activity } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LiveSession {
  id: string;
  type: 'SOS' | 'FriendWalk';
  requester: {
    name: string;
    phone: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  startTime: Date;
  status: 'active' | 'pending' | 'urgent';
  watchers: number;
  lastGPS: Date;
}

interface LiveSessionsListProps {
  sessions: LiveSession[];
  selectedSession?: string;
  onSelectSession: (sessionId: string) => void;
}

export function LiveSessionsList({ 
  sessions, 
  selectedSession, 
  onSelectSession 
}: LiveSessionsListProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'urgent': return 'bg-status-urgent text-white';
      case 'pending': return 'bg-status-pending text-warning-foreground';
      case 'active': return 'bg-status-active text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTimeElapsed = (startTime: Date) => {
    const elapsed = Math.floor((Date.now() - startTime.getTime()) / 1000);
    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
  };

  const getGPSStatus = (lastGPS: Date) => {
    const staleTime = Date.now() - lastGPS.getTime();
    return staleTime > 60000 ? 'stale' : 'fresh';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between px-1">
        <h2 className="text-lg font-semibold">Active Sessions</h2>
        <Badge variant="outline" className="text-xs">
          {sessions.length} Active
        </Badge>
      </div>

      {sessions.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p>No active sessions</p>
            <p className="text-sm">All quiet on campus</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <Card
              key={session.id}
              className={cn(
                "p-4 cursor-pointer transition-all border-2",
                selectedSession === session.id 
                  ? "border-primary bg-primary/5" 
                  : "border-transparent hover:border-border hover:bg-muted/50"
              )}
              onClick={() => onSelectSession(session.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      className={cn("text-xs font-medium", getStatusColor(session.status))}
                    >
                      {session.type}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {getTimeElapsed(session.startTime)}
                    </Badge>
                    {getGPSStatus(session.lastGPS) === 'stale' && (
                      <Badge variant="destructive" className="text-xs">
                        GPS Stale
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h3 className="font-medium">{session.requester.name}</h3>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="truncate">{session.location.address}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Users className="h-3 w-3" />
                      <span>{session.watchers} watching</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>GPS {getTimeElapsed(session.lastGPS)} ago</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button size="sm" variant="outline">
                    <Phone className="h-3 w-3" />
                  </Button>
                  {session.status === 'urgent' && (
                    <div className="w-2 h-2 bg-status-urgent rounded-full animate-pulse-urgent mx-auto" />
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}