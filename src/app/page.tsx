"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Mail, MessageSquare, Shield, Zap, ArrowRight, Star, Users, Eye } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock messages data since we can't import the JSON directly
const messages = [
   {
      title: "Honest Feedback",
      content: "This platform helped me get genuine feedback from my team without any bias.",
      received: "2 days ago",
   },
   {
      title: "Game Changer",
      content: "Finally, a place where people can share their thoughts without fear.",
      received: "1 week ago",
   },
   {
      title: "Improved Communication",
      content: "Our team communication has improved dramatically since we started using this.",
      received: "3 days ago",
   },
   {
      title: "Anonymous & Effective",
      content: "The anonymity makes the feedback so much more valuable and honest.",
      received: "5 days ago",
   },
];

export default function Home() {
   const [isScrolled, setIsScrolled] = useState(false);
   const [isClient, setIsClient] = useState(false);

   useEffect(() => {
      setIsClient(true);

      const handleScroll = () => {
         setIsScrolled(window.scrollY > 10);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
   }, []);

   // Simple carousel implementation without external libraries
   const [currentSlide, setCurrentSlide] = useState(0);

   useEffect(() => {
      if (!isClient) return;

      const interval = setInterval(() => {
         setCurrentSlide((prev) => (prev + 1) % messages.length);
      }, 4000);

      return () => clearInterval(interval);
   }, [isClient]);

   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
         {/* Sticky Header with catchy message */}
         <header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? "bg-slate-900/90 backdrop-blur-md py-2 shadow-xl" : "bg-transparent py-4"}`}
         >
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
               <div className="flex items-center space-x-2">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                     AnonyMe
                  </span>
               </div>

               <div className="flex items-center space-x-4">
                  <div className="hidden md:flex items-center bg-slate-800/60 px-4 py-2 rounded-full border border-purple-500/30">
                     <Zap className="h-4 w-4 text-yellow-400 mr-2 animate-pulse" />
                     <span className="text-sm font-medium text-white">Unleash your thoughts without limits!</span>
                  </div>
                  <Button asChild variant="ghost" className="text-white hover:text-purple-300 hover:bg-slate-800/50">
                     <Link href="/login">Sign In</Link>
                  </Button>
                  <Button
                     asChild
                     className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                  >
                     <Link href="/sign-up">Get Started</Link>
                  </Button>
               </div>
            </div>
         </header>

         {/* Main content */}
         <main className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 py-12 text-white">
            {/* Hero Section */}
            <section className="text-center mb-16 md:mb-20 max-w-4xl mx-auto">
               <div className="inline-flex items-center rounded-full bg-purple-500/10 px-4 py-2 text-sm font-medium text-purple-300 mb-6 border border-purple-500/30">
                  <Shield className="mr-2 h-4 w-4" />
                  Your identity is protected with military-grade encryption
               </div>

               <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                  Speak Your Mind{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                     Without Fear
                  </span>
               </h1>

               <p className="mt-4 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto">
                  AnonyMe allows you to give and receive completely anonymous feedback. Share honest thoughts,
                  constructive criticism, and praise without worrying about repercussions.
               </p>

               <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                     asChild
                     size="lg"
                     className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                  >
                     <Link href="/sign-up">
                        Start Now <ArrowRight className="ml-2 h-5 w-5" />
                     </Link>
                  </Button>
                  <Button
                     asChild
                     variant="outline"
                     size="lg"
                     className="border-purple-500 text-purple-300 hover:bg-purple-950/50 px-8 py-6 text-lg"
                  >
                     <Link href="/about">How It Works</Link>
                  </Button>
               </div>
            </section>

            {/* Stats Section */}
            <section className="w-full max-w-6xl mx-auto mb-20">
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
                     <Users className="h-12 w-12 text-purple-400 mx-auto mb-4" />
                     <h3 className="text-3xl font-bold text-white">50,000+</h3>
                     <p className="text-slate-300">Active Users</p>
                  </div>
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
                     <MessageSquare className="h-12 w-12 text-pink-400 mx-auto mb-4" />
                     <h3 className="text-3xl font-bold text-white">250,000+</h3>
                     <p className="text-slate-300">Messages Shared</p>
                  </div>
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 text-center">
                     <Eye className="h-12 w-12 text-blue-400 mx-auto mb-4" />
                     <h3 className="text-3xl font-bold text-white">100%</h3>
                     <p className="text-slate-300">Anonymous</p>
                  </div>
               </div>
            </section>

            {/* Testimonials Carousel */}
            <section className="w-full max-w-4xl mx-auto mb-20">
               <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">What People Are Sharing</h2>

               <div className="relative">
                  <div className="flex justify-center mb-6">
                     <div className="flex space-x-2">
                        {messages.map((_, index) => (
                           <button
                              key={index}
                              onClick={() => setCurrentSlide(index)}
                              className={`h-3 w-3 rounded-full ${currentSlide === index ? "bg-purple-500" : "bg-slate-600"}`}
                              aria-label={`Go to slide ${index + 1}`}
                           />
                        ))}
                     </div>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl border border-slate-700/50 overflow-hidden transition-all duration-500">
                     <Card className="bg-transparent border-none">
                        <CardHeader className="pb-3">
                           <div className="flex justify-between items-start">
                              <CardTitle className="text-lg text-white">{messages[currentSlide].title}</CardTitle>
                              <div className="flex">
                                 {[...Array(5)].map((_, i) => (
                                    <Star
                                       key={i}
                                       className={`h-4 w-4 ${i < 4 ? "text-yellow-400 fill-yellow-400" : "text-slate-500"}`}
                                    />
                                 ))}
                              </div>
                           </div>
                        </CardHeader>
                        <CardContent>
                           <div className="flex items-start space-x-3">
                              <Mail className="h-5 w-5 text-purple-400 mt-1 flex-shrink-0" />
                              <div>
                                 <p className="text-slate-300">{messages[currentSlide].content}</p>
                                 <p className="text-xs text-slate-500 mt-2">{messages[currentSlide].received}</p>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  </div>

                  <div className="flex justify-center mt-6 space-x-4">
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSlide((currentSlide - 1 + messages.length) % messages.length)}
                        className="bg-slate-800/80 border-slate-700 text-white hover:bg-purple-700"
                     >
                        Previous
                     </Button>
                     <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setCurrentSlide((currentSlide + 1) % messages.length)}
                        className="bg-slate-800/80 border-slate-700 text-white hover:bg-purple-700"
                     >
                        Next
                     </Button>
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className="text-center mb-16 max-w-3xl mx-auto">
               <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 md:p-12 border border-slate-700/50">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to experience truly honest feedback?</h2>
                  <p className="text-slate-300 mb-8">
                     Join thousands of users who are building better relationships through anonymous feedback.
                  </p>
                  <Button
                     asChild
                     size="lg"
                     className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg"
                  >
                     <Link href="/sign-up">
                        Create Your Account Now <ArrowRight className="ml-2 h-5 w-5" />
                     </Link>
                  </Button>
               </div>
            </section>
         </main>

         {/* Footer */}
         <footer className="text-center p-6 md:p-8 bg-slate-900/70 backdrop-blur-md text-slate-400 border-t border-slate-800/50">
            <div className="container mx-auto">
               <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="flex items-center space-x-2 mb-4 md:mb-0">
                     <MessageSquare className="h-6 w-6 text-purple-400" />
                     <span className="text-lg font-bold text-white">AnonyMe</span>
                  </div>
                  <div className="flex space-x-6 mb-4 md:mb-0">
                     <Link href="/privacy" className="text-sm hover:text-purple-400 transition-colors">
                        Privacy Policy
                     </Link>
                     <Link href="/terms" className="text-sm hover:text-purple-400 transition-colors">
                        Terms of Service
                     </Link>
                     <Link href="/contact" className="text-sm hover:text-purple-400 transition-colors">
                        Contact
                     </Link>
                  </div>
                  <div>
                     <p className="text-sm">© {new Date().getFullYear()} True Feedback. All rights reserved.</p>
                  </div>
               </div>
            </div>
         </footer>
      </div>
   );
}
