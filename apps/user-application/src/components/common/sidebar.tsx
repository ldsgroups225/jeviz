import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { authClient } from "@/components/auth/client";
import {
  Home,
  Users,
  BarChart3,
  Settings,
  FileText,
} from "lucide-react";

const sidebarItems = [
  { name: "Dashboard", icon: Home, href: "/app", current: true },
  { name: "Users", icon: Users, href: "/app/users", current: false },
  { name: "Analytics", icon: BarChart3, href: "/app/analytics", current: false },
  { name: "Reports", icon: FileText, href: "/app/reports", current: false },
  { name: "Settings", icon: Settings, href: "/app/settings", current: false },
];

export function Sidebar() {
  const session = authClient.useSession();

  return (
    <div className="hidden md:flex md:w-64 md:flex-col">
      <div className="flex flex-col flex-grow border-r border-border pt-5 pb-4 overflow-y-auto">
        <div className="flex items-center flex-shrink-0 px-4">
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="mt-5 flex-grow flex flex-col">
          <nav className="flex-1 px-2 space-y-1">
            {sidebarItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${
                  item.current
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-accent hover:text-accent-foreground"
                } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
              >
                <item.icon
                  className={`${
                    item.current ? "text-primary-foreground" : "text-muted-foreground"
                  } mr-3 flex-shrink-0 h-5 w-5`}
                  aria-hidden="true"
                />
                {item.name}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex-shrink-0 flex border-t border-border p-4">
          <div className="flex items-center">
            <Avatar className="h-8 w-8">
              <AvatarFallback>
                {(session.data?.user?.name || "U").charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="ml-3">
              <p className="text-sm font-medium">
                {session.data?.user?.name || "User"}
              </p>
              <p className="text-xs text-muted-foreground">
                {session.data?.user?.email || "user@example.com"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}