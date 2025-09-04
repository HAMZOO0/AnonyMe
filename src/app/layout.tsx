import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "../context/AuthProvider";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { ModeToggle } from "@/components/ModeToggle";
import { NavigationMenuDemoComponent } from "@/components/navigation-menu";

const geistSans = Geist({
   variable: "--font-geist-sans",
   subsets: ["latin"],
});

const geistMono = Geist_Mono({
   variable: "--font-geist-mono",
   subsets: ["latin"],
});

export const metadata: Metadata = {
   title: "Annoneme",
   description: "Anonymous app project",
};

export default function RootLayout({
   children,
}: Readonly<{
   children: React.ReactNode;
}>) {
   return (
      <html lang="en" suppressHydrationWarning>
         <AuthProvider>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
               <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
                  <div className="absolute top-4 right-4"></div>

                  {/* Navbar */}
                  <NavigationMenuDemoComponent />

                  <main className="p-4">{children}</main>
                  <Toaster />
               </body>
            </ThemeProvider>
         </AuthProvider>
      </html>
   );
}
