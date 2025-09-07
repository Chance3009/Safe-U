import { useState } from "react";
import { Filter, Calendar, User, MapPin, Image, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface Report {
  id: string;
  category: string;
  summary: string;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  reporter: {
    name?: string;
    isAnonymous: boolean;
  };
  status: 'open' | 'acknowledged' | 'assigned' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  routedTo: 'security' | 'facilities';
  assignee?: string;
  createdAt: Date;
  hasMedia: boolean;
  mediaCount: number;
}

interface ReportsBoardProps {
  reports: Report[];
  onSelectReport: (reportId: string) => void;
  selectedReport?: string;
  userRole?: string;
}

export function ReportsBoard({ 
  reports, 
  onSelectReport, 
  selectedReport,
  userRole = 'Admin'
}: ReportsBoardProps) {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [routeFilter, setRouteFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-status-urgent text-white';
      case 'acknowledged': return 'bg-status-pending text-warning-foreground';
      case 'assigned': return 'bg-accent text-accent-foreground';
      case 'resolved': return 'bg-status-active text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-status-urgent';
      case 'medium': return 'border-l-status-pending';
      case 'low': return 'border-l-status-active';
      default: return 'border-l-muted';
    }
  };

  const filteredReports = reports.filter(report => {
    const statusMatch = statusFilter === 'all' || report.status === statusFilter;
    const routeMatch = routeFilter === 'all' || report.routedTo === routeFilter;
    
    // Role-based filtering
    if (userRole === 'Security Officer' && report.routedTo !== 'security') return false;
    if (userRole === 'Facilities' && report.routedTo !== 'facilities') return false;
    
    return statusMatch && routeMatch;
  });

  const getTimeAgo = (date: Date) => {
    const now = Date.now();
    const diff = now - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    return `${minutes}m ago`;
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Filters:</span>
          </div>
          
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="acknowledged">Acknowledged</SelectItem>
              <SelectItem value="assigned">Assigned</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>

          {userRole === 'Admin' && (
            <Select value={routeFilter} onValueChange={setRouteFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Team" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Teams</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="facilities">Facilities</SelectItem>
              </SelectContent>
            </Select>
          )}

          <div className="ml-auto text-sm text-muted-foreground">
            {filteredReports.length} reports
          </div>
        </div>
      </Card>

      {/* Reports List */}
      <div className="space-y-2">
        {filteredReports.length === 0 ? (
          <Card className="p-8 text-center">
            <div className="text-muted-foreground">
              <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>No reports match your filters</p>
            </div>
          </Card>
        ) : (
          filteredReports.map((report) => (
            <Card
              key={report.id}
              className={cn(
                "p-4 cursor-pointer transition-all border-l-4",
                getPriorityColor(report.priority),
                selectedReport === report.id 
                  ? "border-primary bg-primary/5 shadow-md" 
                  : "hover:bg-muted/50"
              )}
              onClick={() => onSelectReport(report.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge className={cn("text-xs", getStatusColor(report.status))}>
                      {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.routedTo}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {report.category}
                    </Badge>
                  </div>

                  <div>
                    <h3 className="font-medium line-clamp-1">{report.summary}</h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate max-w-48">{report.location.address}</span>
                      </div>
                      {!report.reporter.isAnonymous && report.reporter.name && (
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{report.reporter.name}</span>
                        </div>
                      )}
                      {report.reporter.isAnonymous && (
                        <Badge variant="secondary" className="text-xs">Anonymous</Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{getTimeAgo(report.createdAt)}</span>
                    </div>
                    {report.assignee && (
                      <span>Assigned to: {report.assignee}</span>
                    )}
                    {report.hasMedia && (
                      <div className="flex items-center gap-1">
                        <Image className="h-3 w-3" />
                        <span>{report.mediaCount} files</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {report.priority === 'high' && (
                    <div className="w-2 h-2 bg-status-urgent rounded-full animate-pulse-urgent" />
                  )}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}