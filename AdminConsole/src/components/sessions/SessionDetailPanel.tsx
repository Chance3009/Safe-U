import { Phone, MessageCircle, AlertTriangle, CheckCircle, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface SessionDetail {
  id: string;
  type: 'SOS' | 'FriendWalk';
  requester: {
    name: string;
    phone: string;
    studentId?: string;
  };
  location: {
    lat: number;
    lng: number;
    address: string;
    accuracy: number;
  };
  startTime: Date;
  lastGPS: Date;
  receipts: {
    delivered: Date;
    watching: { count: number; users: string[] };
    onTheWay: { user: string; eta: string }[];
  };
  messages: {
    id: string;
    type: 'canned' | 'system';
    content: string;
    timestamp: Date;
    from: string;
  }[];
}

interface SessionDetailPanelProps {
  session: SessionDetail | null;
  onCallRequester: (phone: string) => void;
  onSendMessage: (sessionId: string, message: string) => void;
  onEscalate: (sessionId: string) => void;
  onEndSession: (sessionId: string, reason: string) => void;
}

const cannedMessages = [
  "Help is on the way - stay where you are",
  "Are you safe? Please respond",
  "Campus security has been notified",
  "Can you move to a safe location?"
];

export function SessionDetailPanel({
  session,
  onCallRequester,
  onSendMessage,
  onEscalate,
  onEndSession
}: SessionDetailPanelProps) {
  if (!session) {
    return (
      <Card className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
          <p>Select a session to view details</p>
        </div>
      </Card>
    );
  }

  const getTimeElapsed = (time: Date) => {
    const elapsed = Math.floor((Date.now() - time.getTime()) / 1000);
    if (elapsed < 60) return `${elapsed}s ago`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ago`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m ago`;
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="destructive">{session.type}</Badge>
              <Badge variant="outline">{getTimeElapsed(session.startTime)}</Badge>
            </div>
            <h2 className="text-xl font-semibold">{session.requester.name}</h2>
            <p className="text-sm text-muted-foreground">{session.requester.phone}</p>
            {session.requester.studentId && (
              <p className="text-xs text-muted-foreground">ID: {session.requester.studentId}</p>
            )}
          </div>
          <Button 
            onClick={() => onCallRequester(session.requester.phone)}
            className="bg-emergency hover:bg-emergency/90"
          >
            <Phone className="h-4 w-4 mr-2" />
            Call Now
          </Button>
        </div>
      </Card>

      {/* Location */}
      <Card className="p-4">
        <h3 className="font-medium mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Location
        </h3>
        <p className="text-sm">{session.location.address}</p>
        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
          <span>Accuracy: ±{session.location.accuracy}m</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Last GPS: {getTimeElapsed(session.lastGPS)}
          </span>
        </div>
      </Card>

      {/* Receipts */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Response Status</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <CheckCircle className="h-4 w-4 text-success" />
            <span>Delivered {getTimeElapsed(session.receipts.delivered)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <Badge variant="outline" className="w-6 h-6 p-0 flex items-center justify-center text-xs">
              {session.receipts.watching.count}
            </Badge>
            <span>People watching</span>
          </div>

          {session.receipts.onTheWay.map((responder, idx) => (
            <div key={idx} className="flex items-center gap-2 text-sm">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <span>{responder.user} on the way (ETA: {responder.eta})</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card className="p-4">
        <h3 className="font-medium mb-3">Quick Actions</h3>
        <div className="grid grid-cols-1 gap-2">
          {cannedMessages.map((message, idx) => (
            <Button
              key={idx}
              variant="outline"
              size="sm"
              onClick={() => onSendMessage(session.id, message)}
              className="justify-start text-xs"
            >
              <MessageCircle className="h-3 w-3 mr-2" />
              {message}
            </Button>
          ))}
        </div>

        <Separator className="my-4" />
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onEscalate(session.id)}
            className="flex-1"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Escalate
          </Button>
          <Button
            variant="destructive"
            onClick={() => onEndSession(session.id, 'resolved')}
            className="flex-1"
          >
            End Session
          </Button>
        </div>
      </Card>

      {/* Recent Messages */}
      {session.messages.length > 0 && (
        <Card className="p-4">
          <h3 className="font-medium mb-3">Recent Messages</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {session.messages.map((message) => (
              <div key={message.id} className="text-sm border-l-2 border-muted pl-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <span>{message.from}</span>
                  <span>{getTimeElapsed(message.timestamp)}</span>
                </div>
                <p className="mt-1">{message.content}</p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}