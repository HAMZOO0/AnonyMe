"use client";

import * as React from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";

import {
   NavigationMenu,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/ModeToggle"; // <-- import here

export function NavigationMenuDemoComponent() {
   const { data: session } = useSession();
   const user: User = session?.user as User;

   return (
      <NavigationMenu className="w-full max-w-none border-b shadow-sm py-2 px-4 bg-background">
         <NavigationMenuList className="flex w-full items-center justify-between">
            {/* Left side: Logo + Links */}
            <div className="flex items-center space-x-4">
               <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                     <Link href="/" className="font-semibold text-lg">
                        MyApp
                     </Link>
                  </NavigationMenuLink>
               </NavigationMenuItem>

               <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                     <Link href="/">Home</Link>
                  </NavigationMenuLink>
               </NavigationMenuItem>

               <NavigationMenuItem>
                  <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                     <Link href="/about">About Us</Link>
                  </NavigationMenuLink>
               </NavigationMenuItem>
            </div>

            {/* Right side: Theme Toggle + User / Auth */}
            <div className="flex items-center gap-3">
               {/* <ModeToggle /> 👈 theme toggle button added here */}
               {user ? (
                  <>
                     <Avatar className="h-9 w-9">
                        <AvatarFallback>
                           {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                     </Avatar>
                     <span className="font-medium text-sm text-foreground">Welcome, {user?.name || user?.email}</span>
                     <Button onClick={() => signOut()} variant="destructive" size="sm">
                        Sign out
                     </Button>
                  </>
               ) : (
                  <>
                     <span className="font-medium text-sm text-muted-foreground">Welcome, Guest</span>
                     <Button asChild variant="ghost" size="sm">
                        <Link href="/sign-in">Sign In</Link>
                     </Button>
                     <Button asChild size="sm">
                        <Link href="/register">Sign Up</Link>
                     </Button>
                  </>
               )}
               <ModeToggle /> {/* 👈 theme toggle button added here */}
            </div>
         </NavigationMenuList>
      </NavigationMenu>
   );
}
