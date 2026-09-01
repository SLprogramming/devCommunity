import Link from "next/link";
import {
  Search,
  Menu,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import { ThemeToggle } from "../theme/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SidebarNav from "@/components/ui/sidebar-nav";
import { Suspense } from "react";
import { signOutAction } from "@/feature/auth/actions";
import { getSession } from "@/lib/get-session";
import { getNotificationsForUser } from "@/feature/notification/queries";
import { NotificationBell } from "@/feature/notification/component/NotificationBell";

async function UserProfile() {
  const session = await getSession();
  const initialNotifications = session?.user?.id
    ? await getNotificationsForUser(session.user.id, undefined, 8)
    : null;

  return (
    <>
      {session ? (
        <>
          {initialNotifications && <NotificationBell initial={initialNotifications} />}
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
      <div className="h-9 w-9 rounded-full bg-muted/60" />
      <div className="h-8 w-8 rounded-full bg-muted" />
    </div>
  );
}

export async function TopBar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-md transition-all">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Section: Mobile Menu Sheet & Logo */}
        <div className="flex items-center gap-4 flex-1 md:flex-none">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-muted-foreground hover:text-foreground"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-72 p-4 flex flex-col">
              <SheetHeader className="text-left mb-4">
                <SheetTitle>
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
                </SheetTitle>
              </SheetHeader>

              {/* Sidebar Navigation */}
              <Suspense>
                <SidebarNav />
              </Suspense>
            </SheetContent>
          </Sheet>

          {/* Logo */}
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

        {/* Center Section: Search Bar */}
        <div className="hidden md:flex max-w-xl w-full mx-8 relative items-center">
          <SearchBar />
        </div>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="ghost"
            size="icon"
            aria-label="Search"
            className="md:hidden text-muted-foreground hover:text-foreground hover:bg-muted"
          >
            <Link href="/search">
              <Search className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="hidden sm:flex border-indigo-500/30 hover:border-indigo-500/60 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 bg-indigo-500/5 hover:bg-indigo-500/10 transition-all font-medium h-9"
          >
            <Link href="/post/create">Create Post</Link>
          </Button>

          <ThemeToggle />

          <Suspense fallback={<UserProfileSkeleton />}>
            <UserProfile />
          </Suspense>
        </div>
      </div>
    </header>
  );
}
