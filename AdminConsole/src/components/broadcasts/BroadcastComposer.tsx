import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import CampusMap from '@/components/map/CampusMap';
import { MessageSquare, History, Zap, Users, MapPin, Clock, Send } from 'lucide-react';

interface BroadcastTemplate {
  id: string;
  name: string;
  title: string;
  message: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  type: 'emergency' | 'weather' | 'maintenance' | 'event';
}

const templates: BroadcastTemplate[] = [
  {
    id: 'emergency-evacuation',
    name: 'Emergency Evacuation',
    title: 'EMERGENCY: Immediate Evacuation Required',
    message: 'Please evacuate the building immediately and proceed to the nearest assembly point. Follow staff instructions.',
    priority: 'critical',
    type: 'emergency'
  },
  {
    id: 'weather-alert',
    name: 'Severe Weather Alert',
    title: 'Weather Alert: Severe Storm Warning',
    message: 'Severe weather conditions expected. Stay indoors and avoid unnecessary travel.',
    priority: 'high',
    type: 'weather'
  },
  {
    id: 'maintenance',
    name: 'Planned Maintenance',
    title: 'Scheduled Maintenance Notice',
    message: 'Planned maintenance will affect services in this area. Please plan accordingly.',
    priority: 'medium',
    type: 'maintenance'
  }
];

const broadcastHistory = [
  {
    id: 'bc-001',
    title: 'Emergency: Gas Leak - Science Building',
    message: 'Gas leak detected in Science Building. Area evacuated. Emergency services on site.',
    priority: 'critical' as const,
    sentAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    recipients: 1247,
    area: 'Science Building Complex'
  },
  {
    id: 'bc-002',
    title: 'Weather Alert: Heavy Rain Expected',
    message: 'Heavy rainfall expected this evening. Exercise caution when walking on campus.',
    priority: 'medium' as const,
    sentAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    recipients: 3456,
    area: 'Campus-wide'
  }
];

interface BroadcastComposerProps {
  onSendBroadcast?: (broadcast: {
    title: string;
    message: string;
    priority: string;
    audience: string;
    area?: { center: [number, number]; radius: number };
  }) => void;
}

const BroadcastComposer: React.FC<BroadcastComposerProps> = ({ onSendBroadcast }) => {
  const [activeTab, setActiveTab] = useState('compose');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState('medium');
  const [audience, setAudience] = useState('campus-wide');
  const [selectedArea, setSelectedArea] = useState<{ center: [number, number]; radius: number } | null>(null);
  const [estimatedRecipients, setEstimatedRecipients] = useState(6306);

  const handleTemplateSelect = (template: BroadcastTemplate) => {
    setTitle(template.title);
    setMessage(template.message);
    setPriority(template.priority);
    setActiveTab('compose');
  };

  const handleAreaSelect = (center: [number, number], radius: number) => {
    setSelectedArea({ center, radius });
    // Estimate recipients based on radius (mock calculation)
    const estimated = Math.floor((radius / 100) * 150);
    setEstimatedRecipients(Math.min(estimated, 6306));
  };

  const handleSend = () => {
    if (onSendBroadcast) {
      onSendBroadcast({
        title,
        message,
        priority,
        audience,
        area: selectedArea
      });
    }
    
    // Reset form
    setTitle('');
    setMessage('');
    setPriority('medium');
    setSelectedArea(null);
    setEstimatedRecipients(6306);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-emergency text-emergency-foreground';
      case 'high': return 'bg-destructive text-destructive-foreground';
      case 'medium': return 'bg-warning text-warning-foreground';
      case 'low': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compose" className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            Compose
          </TabsTrigger>
          <TabsTrigger value="history" className="flex items-center gap-2">
            <History className="w-4 h-4" />
            History
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <Zap className="w-4 h-4" />
            Templates
          </TabsTrigger>
        </TabsList>

        <TabsContent value="compose" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Composer Form */}
            <Card>
              <CardHeader>
                <CardTitle>Compose Broadcast</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Quick Templates */}
                <div>
                  <label className="text-sm font-medium">Quick Templates</label>
                  <Select onValueChange={(value) => {
                    const template = templates.find(t => t.id === value);
                    if (template) handleTemplateSelect(template);
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose a template (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      {templates.map(template => (
                        <SelectItem key={template.id} value={template.id}>
                          {template.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Title */}
                <div>
                  <label className="text-sm font-medium">Title *</label>
                  <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter broadcast title"
                    maxLength={100}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {title.length}/100 characters
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium">Message *</label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter your message"
                    rows={4}
                    maxLength={500}
                  />
                  <div className="text-xs text-muted-foreground mt-1">
                    {message.length}/500 characters
                  </div>
                </div>

                {/* Priority */}
                <div>
                  <label className="text-sm font-medium">Priority</label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="critical">🔴 Critical - Emergency</SelectItem>
                      <SelectItem value="high">🟠 High - Important Notice</SelectItem>
                      <SelectItem value="medium">🟡 Medium - General Info</SelectItem>
                      <SelectItem value="low">⚪ Low - Announcement</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Audience */}
                <div>
                  <label className="text-sm font-medium">Audience</label>
                  <Select value={audience} onValueChange={setAudience}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="campus-wide">All Campus Users</SelectItem>
                      <SelectItem value="students">Students Only</SelectItem>
                      <SelectItem value="staff">Staff Only</SelectItem>
                      <SelectItem value="geo-area">Geographic Area</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Recipients Estimate */}
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4" />
                  <span>Estimated recipients: <strong>{estimatedRecipients.toLocaleString()}</strong></span>
                </div>

                <Separator />

                {/* Send Button */}
                <Button 
                  onClick={handleSend}
                  disabled={!title || !message}
                  className="w-full"
                  size="lg"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Broadcast
                </Button>
                
                <div className="text-xs text-muted-foreground">
                  • Push notifications sent immediately<br/>
                  • Email notifications sent within 5 minutes<br/>
                  • SMS backup for critical alerts
                </div>
              </CardContent>
            </Card>

            {/* Map and Preview */}
            <div className="space-y-4">
              {/* Map */}
              {audience === 'geo-area' && (
                <Card>
                  <CardContent className="p-4">
                    <CampusMap
                      showRadiusSelector
                      onAreaSelect={handleAreaSelect}
                      selectedArea={selectedArea}
                      className="h-64"
                    />
                  </CardContent>
                </Card>
              )}

              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    📱 Mobile Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-slate-900 rounded-lg p-4 text-white max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center">
                        🛡️
                      </div>
                      <span className="text-sm font-medium">Safe-U Alert</span>
                      <Badge className={`text-xs ${getPriorityColor(priority)}`}>
                        {priority.toUpperCase()}
                      </Badge>
                    </div>
                    <div className="font-semibold mb-1 text-sm">
                      {title || 'Broadcast Title'}
                    </div>
                    <div className="text-sm text-gray-300">
                      {message || 'Your broadcast message will appear here...'}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {broadcastHistory.map(broadcast => (
                  <div key={broadcast.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{broadcast.title}</h4>
                          <Badge className={`text-xs ${getPriorityColor(broadcast.priority)}`}>
                            {broadcast.priority}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {broadcast.message}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {broadcast.sentAt.toLocaleString()}
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {broadcast.recipients.toLocaleString()} recipients
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3" />
                            {broadcast.area}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Broadcast Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {templates.map(template => (
                  <div key={template.id} className="border rounded-lg p-4 hover:bg-muted/50 cursor-pointer" onClick={() => handleTemplateSelect(template)}>
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{template.name}</h4>
                      <Badge className={`text-xs ${getPriorityColor(template.priority)}`}>
                        {template.priority}
                      </Badge>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {template.title}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {template.message}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BroadcastComposer;