import { useState } from "react";
import { AdminHeader } from "@/components/layout/AdminHeader";
import { AdminSidebar } from "@/components/layout/AdminSidebar";
import { LiveSessionsList } from "@/components/sessions/LiveSessionsList";
import { SessionDetailPanel } from "@/components/sessions/SessionDetailPanel";
import { ReportsBoard } from "@/components/reports/ReportsBoard";
import ReportDetailPanel from "@/components/reports/ReportDetailPanel";
import BroadcastComposer from "@/components/broadcasts/BroadcastComposer";
import CampusMap from "@/components/map/CampusMap";

// Department contacts for escalation
const departmentContacts = {
  'Computer Science': { name: 'Dr. Sarah Chen', phone: '+60-4-653-3888', email: 'sarah.chen@usm.my' },
  'Engineering': { name: 'Prof. Mike Johnson', phone: '+60-4-653-3889', email: 'mike.johnson@usm.my' },
  'Library Services': { name: 'Lisa Rodriguez', phone: '+60-4-653-3890', email: 'lisa.rodriguez@usm.my' },
  'Student Affairs': { name: 'David Kim', phone: '+60-4-653-3891', email: 'david.kim@usm.my' },
  'Facilities Management': { name: 'Tom Wilson', phone: '+60-4-653-3892', email: 'tom.wilson@usm.my' },
  'Campus Security': { name: 'Officer Martinez', phone: '+60-4-653-3893', email: 'security@usm.my' }
};

// Mock data for demonstration
const mockSessions = [
  {
    id: "ses-001",
    type: "SOS" as const,
    requester: { name: "Sarah Chen", phone: "+1-555-0123" },
    location: { lat: 5.4164, lng: 100.3327, address: "USM Library, Universiti Sains Malaysia, Penang" },
    startTime: new Date(Date.now() - 180000), // 3 minutes ago
    status: "urgent" as const,
    watchers: 3,
    lastGPS: new Date(Date.now() - 30000) // 30 seconds ago
  },
  {
    id: "ses-003",
    type: "FriendWalk" as const,
    requester: { name: "Emma Rodriguez", phone: "+1-555-0125" },
    location: { lat: 5.4180, lng: 100.3310, address: "School of Engineering, USM" },
    startTime: new Date(Date.now() - 1200000), // 20 minutes ago
    status: "escalated" as const, // Only escalated FriendWalk shown
    watchers: 0,
    lastGPS: new Date(Date.now() - 600000), // 10 minutes ago - missed check-in
    missedCheckins: 2,
    plannedRoute: "Engineering to Hostel"
  }
];

const mockReports = [
  {
    id: "rep-001",
    category: "Lighting Issue",
    summary: "Broken streetlight near parking lot C - area is very dark",
    location: { address: "Parking Lot, Pusat Sukan, USM", lat: 5.4149, lng: 100.3299 },
    reporter: { name: "Anonymous User", isAnonymous: true },
    status: "open" as const,
    priority: "high" as const,
    routedTo: "facilities" as const,
    createdAt: new Date(Date.now() - 1800000), // 30 minutes ago
    hasMedia: true,
    mediaCount: 2,
    description: "The streetlight has been flickering for days and now appears to be completely out. This area becomes very dark at night, making it unsafe for students walking to the parking lot.",
    comments: [
      {
        id: "c-001",
        author: "System",
        content: "Report received via voice message and automatically transcribed.",
        timestamp: new Date(Date.now() - 1800000),
        type: "system" as const
      }
    ]
  },
  {
    id: "rep-002",
    category: "Suspicious Activity",
    summary: "Person following students near the science building",
    location: { address: "School of Physics, USM", lat: 5.4179, lng: 100.3288 },
    reporter: { name: "Emma Wilson", isAnonymous: false },
    status: "assigned" as const,
    priority: "high" as const,
    routedTo: "security" as const,
    assignee: "Officer Martinez",
    createdAt: new Date(Date.now() - 600000), // 10 minutes ago
    hasMedia: false,
    mediaCount: 0,
    description: "A person in dark clothing has been observed following students around the science building area. Multiple students have reported feeling uncomfortable.",
    comments: [
      {
        id: "c-002",
        author: "System",
        content: "Report rerouted from facilities to security",
        timestamp: new Date(Date.now() - 580000),
        type: "system" as const
      },
      {
        id: "c-003",
        author: "Dispatcher",
        content: "Assigned to Officer Martinez - investigating area",
        timestamp: new Date(Date.now() - 300000),
        type: "user" as const
      }
    ]
  }
];

const mockSessionDetail = {
  id: "ses-001",
  type: "SOS" as const,
  requester: {
    name: "Sarah Chen",
    phone: "+1-555-0123",
    studentId: "SC2024-001"
  },
  location: {
    lat: 5.4164,
    lng: 100.3327,
    address: "USM Library, Universiti Sains Malaysia, Penang",
    accuracy: 12
  },
  startTime: new Date(Date.now() - 180000),
  lastGPS: new Date(Date.now() - 30000),
  receipts: {
    delivered: new Date(Date.now() - 175000),
    watching: { count: 3, users: ["Officer Martinez", "Security Desk", "RA Johnson"] },
    onTheWay: [{ user: "Officer Martinez", eta: "2 min" }]
  },
  messages: [
    {
      id: "msg-001",
      type: "canned" as const,
      content: "Help is on the way - stay where you are",
      timestamp: new Date(Date.now() - 120000),
      from: "Dispatcher"
    },
    {
      id: "msg-002",
      type: "system" as const,
      content: "Officer Martinez is responding",
      timestamp: new Date(Date.now() - 90000),
      from: "System"
    }
  ]
};

const Index = () => {
  const [activeSection, setActiveSection] = useState('live-sessions');
  const [selectedSession, setSelectedSession] = useState<string>('');
  const [selectedReport, setSelectedReport] = useState<string>('');
  const [viewMode, setViewMode] = useState<'dashboard' | 'sessions'>('sessions'); // Toggle between views

  const handleCallRequester = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleSendMessage = (sessionId: string, message: string) => {
    console.log(`Sending message to ${sessionId}: ${message}`);
    // In real implementation, this would send via WebSocket
  };

  const handleEscalate = (sessionId: string) => {
    console.log(`Escalating session ${sessionId}`);
  };

  const handleEndSession = (sessionId: string, reason: string) => {
    console.log(`Ending session ${sessionId} with reason: ${reason}`);
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'live-sessions':
        return (
          <div className="h-full">
            {/* View Toggle */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">Live Sessions</h2>
              <div className="flex bg-muted rounded-lg p-1">
                <button
                  onClick={() => setViewMode('sessions')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'sessions'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  📋 Sessions List
                </button>
                <button
                  onClick={() => setViewMode('dashboard')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${viewMode === 'dashboard'
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                  🗺️ Live Dashboard
                </button>
              </div>
            </div>

            {viewMode === 'sessions' ? (
              /* Sessions List View */
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                <div className="space-y-4 xl:col-span-1">
                  <LiveSessionsList
                    sessions={mockSessions}
                    selectedSession={selectedSession}
                    onSelectSession={setSelectedSession}
                  />
                </div>
                <div className="xl:col-span-1">
                  <SessionDetailPanel
                    session={selectedSession === 'ses-001' ? mockSessionDetail : null}
                    onCallRequester={handleCallRequester}
                    onSendMessage={handleSendMessage}
                    onEscalate={handleEscalate}
                    onEndSession={handleEndSession}
                  />
                </div>
                <div className="xl:col-span-1">
                  <div className="h-[400px]">
                    <CampusMap
                      className="h-full"
                      incidents={mockSessions.map(s => ({
                        id: s.id,
                        type: s.type,
                        location: { lat: s.location.lat, lng: s.location.lng, address: s.location.address }
                      }))}
                    />
                  </div>
                </div>
              </div>
            ) : (
              /* Live Dashboard View */
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
                <div className="lg:col-span-3">
                  <div className="h-full min-h-[600px]">
                    <CampusMap
                      className="h-full rounded-lg border"
                      incidents={mockSessions.map(s => ({
                        id: s.id,
                        type: s.type,
                        location: { lat: s.location.lat, lng: s.location.lng, address: s.location.address },
                        status: s.status,
                        timestamp: s.startTime
                      }))}
                    />
                  </div>
                </div>
                <div className="lg:col-span-1 space-y-4">
                  {/* Quick Stats */}
                  <div className="bg-background rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Active Sessions</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>🚨 SOS Alerts</span>
                        <span className="font-medium text-red-600">
                          {mockSessions.filter(s => s.type === 'SOS').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>🚶 Escalated FriendWalk</span>
                        <span className="font-medium text-orange-600">
                          {mockSessions.filter(s => s.type === 'FriendWalk' && s.status === 'escalated').length}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>👥 Total Responders</span>
                        <span className="font-medium">
                          {mockSessions.reduce((acc, s) => acc + s.watchers, 0)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Session List */}
                  <div className="bg-background rounded-lg border p-4">
                    <h3 className="font-medium mb-3">Sessions ({mockSessions.length})</h3>
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                      {mockSessions.map(session => (
                        <div
                          key={session.id}
                          className={`p-3 rounded-md border cursor-pointer transition-colors ${selectedSession === session.id
                            ? 'bg-primary/10 border-primary'
                            : 'hover:bg-muted/50'
                            }`}
                          onClick={() => setSelectedSession(session.id)}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">
                              {session.type === 'SOS' ? '🚨' : '🚶'}
                            </span>
                            <span className="font-medium text-sm">
                              {session.requester.name}
                            </span>
                            <span className={`px-2 py-0.5 rounded text-xs font-medium ${session.status === 'urgent' ? 'bg-red-100 text-red-700' :
                              session.status === 'escalated' ? 'bg-orange-100 text-orange-700' :
                                'bg-blue-100 text-blue-700'
                              }`}>
                              {session.status}
                            </span>
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {session.location.address}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(session.startTime).toLocaleTimeString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Selected Session Actions */}
                  {selectedSession && (
                    <div className="bg-background rounded-lg border p-4">
                      <h3 className="font-medium mb-3">Quick Actions</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => {
                            const session = mockSessions.find(s => s.id === selectedSession);
                            if (session) handleCallRequester(session.requester.phone);
                          }}
                          className="w-full px-3 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          📞 Call Requester
                        </button>
                        <button
                          onClick={() => setViewMode('sessions')}
                          className="w-full px-3 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          📋 View Full Details
                        </button>
                        <button
                          onClick={() => handleEscalate(selectedSession)}
                          className="w-full px-3 py-2 bg-orange-600 text-white rounded-md text-sm font-medium hover:bg-orange-700 transition-colors"
                        >
                          ⚡ Escalate to 999
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );

      case 'reports':
        return (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            <div>
              <ReportsBoard
                reports={mockReports}
                selectedReport={selectedReport}
                onSelectReport={setSelectedReport}
              />
            </div>
            <div>
              <ReportDetailPanel
                report={mockReports.find(r => r.id === selectedReport) || null}
                onAcknowledge={(id) => console.log('Acknowledge', id)}
                onAssign={(id, assignee) => console.log('Assign', id, assignee)}
                onResolve={(id, resolution) => console.log('Resolve', id, resolution)}
                onReroute={(id, route) => console.log('Reroute', id, route)}
                onEscalate={(id, dept, contact) => console.log('Escalate', id, dept, contact)}
                onAddComment={(id, comment) => console.log('Add comment', id, comment)}
              />
            </div>
          </div>
        );

      case 'broadcasts':
        return (
          <BroadcastComposer
            onSendBroadcast={(broadcast) => console.log('Send broadcast', broadcast)}
          />
        );

      case 'moderation':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">Content Moderation</h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📊 Pending Review: 2</span>
                <span>•</span>
                <span>⚡ Escalated: 1</span>
                <span>•</span>
                <span>✅ Approved Today: 12</span>
              </div>
            </div>

            {/* Moderation Dashboard */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Community Tips Queue */}
              <div className="bg-background rounded-lg border p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  💡 Community Tips Queue
                  <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded text-xs font-medium">
                    2 Pending
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* Tip 1 - Pending */}
                  <div className="border rounded-lg p-4 bg-orange-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span className="font-medium text-sm">Safety Tip</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Pending</span>
                      </div>
                      <span className="text-xs text-muted-foreground">2 min ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      "The lighting near the engineering building parking lot is very dim. Students should use the main walkway after dark for better visibility and safety."
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        📍 Engineering Building • Anonymous
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          ✓ Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                          ✗ Reject
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                          ↗ Escalate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Tip 2 - Pending */}
                  <div className="border rounded-lg p-4 bg-orange-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-orange-500 rounded-full"></span>
                        <span className="font-medium text-sm">Safety Tip</span>
                        <span className="px-2 py-0.5 bg-orange-100 text-orange-700 rounded text-xs">Pending</span>
                      </div>
                      <span className="text-xs text-muted-foreground">15 min ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      "Broken glass near the gym entrance hasn't been cleaned up. Someone could get hurt walking through that area."
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        📍 Sports Complex • Lisa Wong
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          ✓ Approve
                        </button>
                        <button className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">
                          ✗ Reject
                        </button>
                        <button className="px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700">
                          ↗ Escalate
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Approved Tip */}
                  <div className="border rounded-lg p-4 bg-green-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        <span className="font-medium text-sm">Safety Tip</span>
                        <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded text-xs">Approved</span>
                      </div>
                      <span className="text-xs text-muted-foreground">1 hour ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      "The new emergency call boxes are now active around the library area. Look for the blue lights!"
                    </p>
                    <div className="text-xs text-muted-foreground">
                      📍 Library Area • Campus Security • Approved by Admin
                    </div>
                  </div>
                </div>
              </div>

              {/* Department Escalation */}
              <div className="bg-background rounded-lg border p-6">
                <h3 className="font-medium mb-4 flex items-center gap-2">
                  ⚡ Department Escalation
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    1 Escalated
                  </span>
                </h3>

                <div className="space-y-4">
                  {/* Escalated Item */}
                  <div className="border rounded-lg p-4 bg-blue-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        <span className="font-medium text-sm">Safety Concern</span>
                        <span className="px-2 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">Escalated</span>
                      </div>
                      <span className="text-xs text-muted-foreground">30 min ago</span>
                    </div>
                    <p className="text-sm mb-3">
                      "The glass near the gym entrance needs immediate attention - broken glass hazard reported by multiple users."
                    </p>
                    <div className="bg-blue-100 rounded p-3 mb-3">
                      <div className="font-medium text-sm text-blue-800 mb-1">
                        🏢 Escalated to: Facilities Management
                      </div>
                      <div className="text-sm text-blue-700">
                        <strong>Contact:</strong> Tom Wilson<br />
                        <strong>Phone:</strong> +60-4-653-3892<br />
                        <strong>Email:</strong> tom.wilson@usm.my
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-xs text-muted-foreground">
                        📍 Sports Complex • Originally reported by Lisa Wong
                      </div>
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">
                          📞 Call Department
                        </button>
                        <button className="px-3 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700">
                          📧 Email Update
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Department Contacts */}
                  <div className="border rounded-lg p-4">
                    <h4 className="font-medium text-sm mb-3">Quick Escalation Contacts</h4>
                    <div className="grid grid-cols-1 gap-2">
                      {Object.entries(departmentContacts).slice(0, 4).map(([dept, contact]) => (
                        <div key={dept} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-xs">{dept}</div>
                            <div className="text-xs text-muted-foreground">{contact.name}</div>
                          </div>
                          <div className="flex gap-1">
                            <button className="px-2 py-1 bg-primary text-primary-foreground rounded text-xs">
                              📞
                            </button>
                            <button className="px-2 py-1 bg-secondary text-secondary-foreground rounded text-xs">
                              📧
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Moderation Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-background rounded-lg border p-4">
                <div className="text-2xl font-bold text-orange-600">2</div>
                <div className="text-sm text-muted-foreground">Pending Review</div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-2xl font-bold text-green-600">12</div>
                <div className="text-sm text-muted-foreground">Approved Today</div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-2xl font-bold text-blue-600">1</div>
                <div className="text-sm text-muted-foreground">Escalated</div>
              </div>
              <div className="bg-background rounded-lg border p-4">
                <div className="text-2xl font-bold text-red-600">0</div>
                <div className="text-sm text-muted-foreground">Rejected Today</div>
              </div>
            </div>
          </div>
        );

      case 'settings':
        return (
          <div className="space-y-6">
            {/* Emergency Contacts Management */}
            <div className="bg-background rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Emergency Contacts Management</h3>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Upload Contact List (CSV)</label>
                    <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                      <div className="space-y-2">
                        <div className="text-muted-foreground">
                          📁 Drag & drop your CSV file here, or click to browse
                        </div>
                        <button className="text-primary hover:underline text-sm">
                          Choose File
                        </button>
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Expected format: name, phone, email, department, role
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Contacts</label>
                    <div className="border rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
                      {Object.entries(departmentContacts).map(([dept, contact]) => (
                        <div key={dept} className="flex items-center justify-between p-2 bg-muted/50 rounded">
                          <div>
                            <div className="font-medium text-sm">{contact.name}</div>
                            <div className="text-xs text-muted-foreground">{dept} • {contact.phone}</div>
                          </div>
                          <button className="text-destructive hover:underline text-xs">Remove</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm">
                    Upload & Validate
                  </button>
                  <button className="px-4 py-2 border border-input rounded-md hover:bg-accent text-sm">
                    Download Template
                  </button>
                  <button className="px-4 py-2 border border-input rounded-md hover:bg-accent text-sm">
                    Export Current
                  </button>
                </div>
              </div>
            </div>

            {/* Campus Data Management */}
            <div className="bg-background rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">Campus Data Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Safe Points (GeoJSON)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <div className="text-muted-foreground text-sm">📍 Upload safe points data</div>
                  </div>
                  <div className="text-xs text-muted-foreground">45 points currently loaded</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Lit Paths (GeoJSON)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <div className="text-muted-foreground text-sm">🚶 Upload walking paths</div>
                  </div>
                  <div className="text-xs text-muted-foreground">12 paths currently loaded</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Facility Hours (CSV)</label>
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-4 text-center">
                    <div className="text-muted-foreground text-sm">🏢 Upload schedules</div>
                  </div>
                  <div className="text-xs text-muted-foreground">8 facilities configured</div>
                </div>
              </div>
            </div>

            {/* System Settings */}
            <div className="bg-background rounded-lg border p-6">
              <h3 className="text-lg font-medium mb-4">System Configuration</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">SOS Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Escalation Timeout (minutes)</label>
                      <input type="number" className="w-20 px-2 py-1 border rounded text-sm" defaultValue="5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Auto-call 999 after</label>
                      <input type="number" className="w-20 px-2 py-1 border rounded text-sm" defaultValue="10" />
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">FriendWalk Settings</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Check-in interval (minutes)</label>
                      <input type="number" className="w-20 px-2 py-1 border rounded text-sm" defaultValue="5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm">Missed check-ins before escalation</label>
                      <input type="number" className="w-20 px-2 py-1 border rounded text-sm" defaultValue="2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex items-center justify-center h-full bg-muted/30 rounded-lg">
            <div className="text-center text-muted-foreground">
              <h3 className="text-lg font-medium mb-2">{activeSection.replace('-', ' ').toUpperCase()}</h3>
              <p>This section is coming soon...</p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader
        activeSessions={mockSessions.length}
        pendingReports={mockReports.filter(r => r.status === 'open').length}
      />

      <div className="flex h-[calc(100vh-80px)]">
        <AdminSidebar
          activeSection={activeSection}
          onSectionChange={setActiveSection}
        />

        <main className="flex-1 p-6 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Index;
