import { Button } from "@/components/ui/button";
import { authClient } from "@/components/auth/client";
import { Bell } from "lucide-react";

export function Header() {
  return (
    <header className="bg-background border-b border-border">
      <div className="flex items-center justify-between px-6 py-4">
        <h1 className="text-2xl font-semibold"></h1>
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              authClient.signOut({
                query: {
                  redirect: "/",
                },
              })
            }
          >
            Sign Out
          </Button>
        </div>
      </div>
    </header>
  );
}
