import Link from "next/link";
import { Search, Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { signOutAction } from "@/feature/auth/actions";
async function UserProfile() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      {session ? (
        <>
          {" "}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground hover:bg-muted h-9 w-9 rounded-full"
          >
            <Bell className="h-5 w-5" />
            {/* Notification Badge Indicator */}
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-destructive ring-2 ring-background" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full ring-offset-background focus-visible:ring-1 focus-visible:ring-border"
              >
                <Avatar className="h-8 w-8 border border-border">
                  <AvatarImage
                    src={session?.user?.image || undefined}
                    alt="User avatar"
                  />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                    {session?.user?.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 mt-2 bg-popover/95 backdrop-blur-md border-border text-popover-foreground"
              align="end"
              forceMount
            >
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none text-foreground">
                    {session?.user?.name || "User Name"}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session?.user?.email || "user@example.com"}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-border" />
              <Link href={"/profile"}>
                <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                  Profile
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                Writing Space
              </DropdownMenuItem>
              <DropdownMenuItem className="focus:bg-accent focus:text-accent-foreground cursor-pointer">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-border" />
              <form action={signOutAction}>
                <DropdownMenuItem
                  asChild
                  className="focus:bg-destructive/10 focus:text-destructive text-destructive cursor-pointer"
                >
                  <button type="submit" className="w-full text-left">
                    Sign out
                  </button>
                </DropdownMenuItem>
              </form>
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      ) : (
        <Button asChild>
          <Link href="/login">Login</Link>
        </Button>
      )}
    </>
  );
}
function UserProfileSkeleton() {
  return (
    <div className="flex items-center gap-3 animate-pulse">
      {/* Mimics the Notification Bell Button */}
      <div className="h-9 w-9 rounded-full bg-muted/60" />

      {/* Mimics the User Profile Avatar Button */}
      <div className="h-8 w-8 rounded-full bg-muted" />
    </div>
  );
}
export async function TopBar() {
  // Debugging line to check session value

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu & Logo */}
        <div className="flex items-center gap-4 flex-1 md:flex-none">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Stylized DEV-inspired Logo Block */}
          <Link
            href="/"
            className="flex items-center gap-2 font-bold tracking-tight"
          >
            <span className="rounded bg-gradient-to-br from-indigo-500 to-purple-600 px-2.5 py-1 text-white text-lg font-black shadow-md shadow-indigo-500/10">
              DEV
              <span className="text-indigo-600 bg-white dark:bg-neutral-900 dark:text-indigo-400 ml-0.5 px-0.5 rounded-sm text-xs font-bold align-super">
                AI
              </span>
            </span>
          </Link>
        </div>

        {/* Center Section: Search Bar (DEV Community Style) */}
        <div className="hidden md:flex max-w-xl w-full mx-8 relative items-center">
          <div className="absolute left-3 text-muted-foreground pointer-events-none">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="search"
            placeholder="Search posts, tags, or creators..."
            className="w-full pl-9 pr-12 h-9 bg-muted/40 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/50 transition-all rounded-md"
          />
          {/* Keyboard Shortcut Indicator */}
          <kbd className="absolute right-3 hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-background px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
            <span>/</span>
          </kbd>
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-3">
          {/* Search Button for Mobile Only */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Search className="h-5 w-5" />
          </Button>

          {/* DEV-style highlighted Create Post Button */}
          <Button
            asChild
            variant="outline"
            className="hidden sm:flex border-indigo-500/30 hover:border-indigo-500/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all font-medium h-9"
          >
            <Link href="/post/create">Create Post</Link>
          </Button>

          <ThemeToggle />

          {/* Notifications Bell */}

          {/* User Profile Dropdown */}

          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
