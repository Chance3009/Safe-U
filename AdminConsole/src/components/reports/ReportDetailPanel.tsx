import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  MapPin, 
  User, 
  Clock, 
  MessageSquare, 
  CheckCircle, 
  ArrowRight, 
  AlertTriangle,
  Phone,
  Mail,
  Image,
  Play
} from 'lucide-react';

interface Report {
  id: string;
  category: string;
  summary: string;
  location: { address: string; lat: number; lng: number };
  reporter: { name: string; isAnonymous: boolean };
  status: 'open' | 'assigned' | 'acknowledged' | 'resolved';
  priority: 'urgent' | 'high' | 'medium' | 'low';
  routedTo: 'security' | 'facilities';
  assignee?: string;
  createdAt: Date;
  hasMedia: boolean;
  mediaCount: number;
  description?: string;
  comments?: Array<{
    id: string;
    author: string;
    content: string;
    timestamp: Date;
    type: 'system' | 'user';
  }>;
}

interface ReportDetailPanelProps {
  report: Report | null;
  onAcknowledge?: (reportId: string) => void;
  onAssign?: (reportId: string, assignee: string) => void;
  onResolve?: (reportId: string, resolution: string) => void;
  onReroute?: (reportId: string, newRoute: 'security' | 'facilities') => void;
  onEscalate?: (reportId: string, department: string, contact: string) => void;
  onAddComment?: (reportId: string, comment: string) => void;
}

const departmentContacts = {
  'Computer Science': { name: 'Dr. Sarah Chen', phone: '+1-555-0101', email: 'sarah.chen@university.edu' },
  'Engineering': { name: 'Prof. Mike Johnson', phone: '+1-555-0102', email: 'mike.johnson@university.edu' },
  'Library Services': { name: 'Lisa Rodriguez', phone: '+1-555-0103', email: 'lisa.rodriguez@university.edu' },
  'Student Affairs': { name: 'David Kim', phone: '+1-555-0104', email: 'david.kim@university.edu' },
  'Facilities Management': { name: 'Tom Wilson', phone: '+1-555-0105', email: 'tom.wilson@university.edu' },
  'Campus Security': { name: 'Officer Martinez', phone: '+1-555-0106', email: 'security@university.edu' }
};

const ReportDetailPanel: React.FC<ReportDetailPanelProps> = ({
  report,
  onAcknowledge,
  onAssign,
  onResolve,
  onReroute,
  onEscalate,
  onAddComment
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedAssignee, setSelectedAssignee] = useState('');
  const [resolutionNote, setResolutionNote] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');

  if (!report) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Select a report to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'bg-emergency text-emergency-foreground';
      case 'acknowledged': return 'bg-warning text-warning-foreground';
      case 'assigned': return 'bg-accent text-accent-foreground';
      case 'resolved': return 'bg-success text-success-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const handleEscalate = () => {
    if (selectedDepartment && onEscalate) {
      const contact = departmentContacts[selectedDepartment as keyof typeof departmentContacts];
      onEscalate(report.id, selectedDepartment, `${contact.name} (${contact.phone})`);
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <CardTitle className="text-lg">{report.category}</CardTitle>
              <Badge className={getStatusColor(report.status)}>
                {report.status.toUpperCase()}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={getPriorityColor(report.priority)}>
                {report.priority.toUpperCase()}
              </Badge>
              <Badge variant="outline" className="text-xs">
                {report.routedTo === 'security' ? '👮 Security' : '🔧 Facilities'}
              </Badge>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground">
          Report #{report.id}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary */}
        <div>
          <h4 className="font-medium mb-2">Summary</h4>
          <p className="text-sm">{report.summary}</p>
          {report.description && (
            <p className="text-sm text-muted-foreground mt-2">{report.description}</p>
          )}
        </div>

        {/* Reporter Information */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <User className="w-4 h-4" />
            Reporter Information
          </h4>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs">
                  {report.reporter.isAnonymous ? '?' : report.reporter.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm">
                {report.reporter.isAnonymous ? 'Anonymous Reporter' : report.reporter.name}
              </span>
            </div>
          </div>
        </div>

        {/* Location */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Location
          </h4>
          <p className="text-sm">{report.location.address}</p>
          <div className="text-xs text-muted-foreground">
            {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
          </div>
        </div>

        {/* Media */}
        {report.hasMedia && (
          <div>
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Media ({report.mediaCount})
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {/* Mock media thumbnails */}
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80">
                <Play className="w-6 h-6 text-muted-foreground" />
              </div>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80">
                <Image className="w-6 h-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Created:</span>
              <span>{report.createdAt.toLocaleDateString()} {report.createdAt.toLocaleTimeString()}</span>
            </div>
            {report.assignee && (
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assigned to:</span>
                <span>{report.assignee}</span>
              </div>
            )}
          </div>
        </div>

        {/* Department Escalation */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Department Escalation
          </h4>
          <div className="space-y-3">
            <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
              <SelectTrigger>
                <SelectValue placeholder="Select department to escalate to" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(departmentContacts).map(([dept, contact]) => (
                  <SelectItem key={dept} value={dept}>
                    {dept} - {contact.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {selectedDepartment && (
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">
                  {departmentContacts[selectedDepartment as keyof typeof departmentContacts].name}
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                  <div className="flex items-center gap-1">
                    <Phone className="w-3 h-3" />
                    {departmentContacts[selectedDepartment as keyof typeof departmentContacts].phone}
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {departmentContacts[selectedDepartment as keyof typeof departmentContacts].email}
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              onClick={handleEscalate}
              disabled={!selectedDepartment}
              className="w-full"
              variant="outline"
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Escalate to Department
            </Button>
          </div>
        </div>

        <Separator />

        {/* Actions */}
        <div className="space-y-3">
          <h4 className="font-medium">Actions</h4>
          
          <div className="grid grid-cols-2 gap-2">
            {report.status === 'open' && onAcknowledge && (
              <Button onClick={() => onAcknowledge(report.id)} size="sm">
                <CheckCircle className="w-4 h-4 mr-2" />
                Acknowledge
              </Button>
            )}
            
            {report.status !== 'resolved' && onReroute && (
              <Button 
                onClick={() => onReroute(report.id, report.routedTo === 'security' ? 'facilities' : 'security')}
                variant="outline"
                size="sm"
              >
                <ArrowRight className="w-4 h-4 mr-2" />
                Reroute
              </Button>
            )}
          </div>

          {/* Assignment */}
          {report.status === 'acknowledged' && onAssign && (
            <div className="space-y-2">
              <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
                <SelectTrigger>
                  <SelectValue placeholder="Assign to..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="officer-martinez">Officer Martinez</SelectItem>
                  <SelectItem value="tech-support">Tech Support Team</SelectItem>
                  <SelectItem value="maintenance">Maintenance Crew</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => selectedAssignee && onAssign(report.id, selectedAssignee)}
                disabled={!selectedAssignee}
                size="sm"
                className="w-full"
              >
                Assign Case
              </Button>
            </div>
          )}

          {/* Resolution */}
          {report.status === 'assigned' && onResolve && (
            <div className="space-y-2">
              <Textarea
                placeholder="Resolution notes..."
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
              />
              <Button 
                onClick={() => resolutionNote && onResolve(report.id, resolutionNote)}
                disabled={!resolutionNote}
                size="sm"
                className="w-full"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Mark Resolved
              </Button>
            </div>
          )}
        </div>

        <Separator />

        {/* Comments */}
        <div className="space-y-3">
          <h4 className="font-medium">Comments ({report.comments?.length || 0})</h4>
          
          {/* Existing Comments */}
          {report.comments && report.comments.length > 0 && (
            <div className="space-y-3 max-h-40 overflow-y-auto">
              {report.comments.map(comment => (
                <div key={comment.id} className="border-l-2 border-muted pl-3">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="font-medium">{comment.author}</span>
                    <span>{comment.timestamp.toLocaleString()}</span>
                    {comment.type === 'system' && <Badge variant="outline" className="text-xs">System</Badge>}
                  </div>
                  <p className="text-sm mt-1">{comment.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Add Comment */}
          <div className="space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={2}
            />
            <Button 
              onClick={() => {
                if (newComment.trim() && onAddComment) {
                  onAddComment(report.id, newComment);
                  setNewComment('');
                }
              }}
              disabled={!newComment.trim()}
              size="sm"
            >
              Add Comment
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReportDetailPanel;
