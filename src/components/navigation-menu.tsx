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

export function NavigationMenuDemoComponent() {
   const { data: session } = useSession();
   const user: User = session?.user as User;

   return (
      <NavigationMenu viewport={false}>
         <NavigationMenuList className="flex items-center gap-4">
            {/* Home */}
            <NavigationMenuItem>
               <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/">Home</Link>
               </NavigationMenuLink>
            </NavigationMenuItem>

            {/* About Us */}
            <NavigationMenuItem>
               <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                  <Link href="/about">About Us</Link>
               </NavigationMenuLink>
            </NavigationMenuItem>

            {/* Right side: user info */}
            <div className="ml-auto flex items-center gap-3">
               {user ? (
                  <>
                     {/* Circular avatar with first letter */}
                     <div className="w-9 h-9 flex items-center justify-center rounded-full bg-blue-500 text-white font-bold">
                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase()}
                     </div>
                     <span className="font-medium">Welcome, {user?.name || user?.email}</span>
                     <button
                        onClick={() => signOut()}
                        className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                     >
                        Sign out
                     </button>
                  </>
               ) : (
                  <>
                     <span className="font-medium">Welcome, Guest</span>
                     <Link
                        className="px-3 py-1 rounded-md bg-red-500 text-white hover:bg-red-600 transition"
                        href={"sign-in"}
                     >
                        Signin
                     </Link>
                  </>
               )}
            </div>
         </NavigationMenuList>
      </NavigationMenu>
   );
}
