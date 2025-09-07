import { Bell, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface AdminHeaderProps {
  currentUser?: {
    name: string;
    role: string;
  };
  activeSessions?: number;
  pendingReports?: number;
}

export function AdminHeader({
  currentUser = { name: "Admin User", role: "Dispatcher" },
  activeSessions = 0,
  pendingReports = 0
}: AdminHeaderProps) {
  return (
    <header className="bg-primary border-b border-primary/20 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <img src="/Safe-U.png" alt="Safe-U" className="h-8 w-8" />
            <div>
              <h1 className="text-xl font-bold text-primary-foreground">Safe-U Admin Console</h1>
              <p className="text-sm text-primary-foreground/70">Campus Safety Management</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            {activeSessions > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-status-urgent rounded-full animate-pulse-urgent" />
                <span className="text-sm text-primary-foreground">
                  {activeSessions} Active Sessions
                </span>
              </div>
            )}

            {pendingReports > 0 && (
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                {pendingReports} Pending Reports
              </Badge>
            )}
          </div>

          {/* Action Buttons */}
          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
            <Bell className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" className="text-primary-foreground hover:bg-primary-hover">
            <Settings className="h-4 w-4" />
          </Button>

          {/* User Info */}
          <div className="flex items-center gap-2 text-primary-foreground">
            <User className="h-4 w-4" />
            <div className="text-sm">
              <div className="font-medium">{currentUser.name}</div>
              <div className="text-xs text-primary-foreground/70">{currentUser.role}</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}