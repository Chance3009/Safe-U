import { 
  Activity, 
  FileText, 
  Megaphone, 
  Shield, 
  MapPin, 
  Settings,
  Users
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  userRole?: string;
}

const navigationItems = [
  {
    id: 'live-sessions',
    label: 'Live Sessions',
    icon: Activity,
    description: 'Active SOS & FriendWalk',
    roles: ['Dispatcher', 'Security Officer', 'Admin']
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    description: 'Incident Management',
    roles: ['Security Officer', 'Facilities', 'Admin']
  },
  {
    id: 'broadcasts',
    label: 'Broadcasts',
    icon: Megaphone,
    description: 'Geo Alerts',
    roles: ['Dispatcher', 'Admin']
  },
  {
    id: 'moderation',
    label: 'Moderation',
    icon: Shield,
    description: 'Community Tips',
    roles: ['Moderator', 'Admin']
  },
  {
    id: 'campus-data',
    label: 'Campus Data',
    icon: MapPin,
    description: 'Safe Points & Routes',
    roles: ['Admin']
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    description: 'Policy & Configuration',
    roles: ['Admin']
  }
];

export function AdminSidebar({ 
  activeSection, 
  onSectionChange, 
  userRole = 'Admin' 
}: AdminSidebarProps) {
  const availableItems = navigationItems.filter(item => 
    item.roles.includes(userRole)
  );

  return (
    <aside className="w-64 bg-sidebar border-r border-sidebar-border">
      <nav className="p-4 space-y-2">
        {availableItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeSection === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onSectionChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors text-left group",
                isActive 
                  ? "bg-sidebar-accent text-sidebar-accent-foreground" 
                  : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
              )}
            >
              <Icon className={cn(
                "h-5 w-5 transition-colors",
                isActive ? "text-sidebar-primary" : "text-sidebar-foreground group-hover:text-sidebar-primary"
              )} />
              <div className="flex-1">
                <div className="font-medium text-sm">{item.label}</div>
                <div className="text-xs opacity-70">{item.description}</div>
              </div>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}