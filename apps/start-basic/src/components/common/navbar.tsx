import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserAvatarTrigger } from "@/components/auth/user-avatar-trigger";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "lucide-react";
import { Link, useNavigate } from "@tanstack/react-router";

export function Navbar() {
  const nav = useNavigate();
  const navSections = [
    {
      title: "Database",
      items: [
        {
          label: "Setup",
          link: () =>
            nav({
              to: "/database",
            }),
        },
        {
          label: "Queries",
          link: () =>
            nav({
              to: "/database/queries",
            }),
        },
      ],
    },
    {
      title: "Auth",
      items: [
        {
          label: "Setup",
          link: () =>
            nav({
              to: "/auth",
            }),
        },
        {
          label: "Client",
          link: () =>
            nav({
              to: "/auth/client",
            }),
        },
      ],
    },
  ];

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <div className="bg-background/80 backdrop-blur-md border rounded-full px-6 py-2 shadow-lg">
        <div className="flex items-center justify-between gap-4">
          {/* Left side - User Avatar */}
          <UserAvatarTrigger />

          {/* Center - Logo/Title */}
          <Link to="/" className="flex items-center">
            <span className="font-semibold text-foreground">Your App</span>
          </Link>

          {/* Right side - Hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <SheetHeader className="pb-6">
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>

              <div className="space-y-6">
                {/* Navigation Links */}
                <div className="space-y-8">
                  {navSections.map((section) => (
                    <div key={section.title} className="space-y-3">
                      <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground/80 border-b border-border/50 pb-2">
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {section.items.map((item) => (
                          <Button
                            key={item.label}
                            variant="ghost"
                            className="w-full justify-start h-9 px-6 text-sm text-foreground/90 hover:text-foreground hover:bg-accent/50 transition-colors"
                            onClick={item.link}
                          >
                            {item.label}
                          </Button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Theme Settings */}
                <div className="space-y-3 border-t pt-6">
                  <h3 className="px-3 text-sm font-medium text-muted-foreground">
                    Settings
                  </h3>
                  <div className="px-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Theme</span>
                      <ThemeToggle />
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  );
}
