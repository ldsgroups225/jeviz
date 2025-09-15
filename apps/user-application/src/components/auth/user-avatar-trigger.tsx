import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DialogTrigger } from "@/components/ui/dialog";
import { authClient } from "@/components/auth/client";
import { AccountDialog } from "@/components/auth/account-dialog";

export function UserAvatarTrigger() {
  const { data: session, error } = authClient.useSession();

  const signIn = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  if (!session || error) {
    return (
      <Button onClick={signIn} variant="outline">
        Sign In
      </Button>
    );
  }

  console.log(session);

  const user = session.user;
  const fallbackText = user.name
    ? user.name.charAt(0).toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <AccountDialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full p-0">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={user.image || undefined}
              alt={user.name || "User"}
            />
            <AvatarFallback>{fallbackText}</AvatarFallback>
          </Avatar>
        </Button>
      </DialogTrigger>
    </AccountDialog>
  );
}
