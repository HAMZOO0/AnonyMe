"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
   UserPlus,
   Link as LinkIcon,
   MessageSquare,
   Shield,
   ArrowRight,
   CheckCircle,
   Mail,
   Users,
   BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function HowItWorks() {
   const [activeStep, setActiveStep] = useState(1);

   const steps = [
      {
         id: 1,
         title: "Create Your Account",
         description: "Sign up in less than a minute with just your email",
         icon: <UserPlus className="h-8 w-8" />,
         details:
            "Getting started is quick and easy. Simply provide your email address, create a password, and you're ready to start receiving anonymous feedback.",
      },
      {
         id: 2,
         title: "Generate Your Unique Link",
         description: "Create a personalized feedback link to share with others",
         icon: <LinkIcon className="h-8 w-8" />,
         details:
            "Our system generates a unique URL that you can share with anyone from whom you want to receive feedback. Customize it with your name or purpose if you'd like.",
      },
      {
         id: 3,
         title: "Share Your Link",
         description: "Send your feedback link to colleagues, friends, or anyone",
         icon: <MessageSquare className="h-8 w-8" />,
         details:
            "Share your unique feedback link via email, messaging apps, or social media. The people you share with can provide feedback without creating an account.",
      },
      {
         id: 4,
         title: "Receive Anonymous Feedback",
         description: "Get honest, completely anonymous responses",
         icon: <Shield className="h-8 w-8" />,
         details:
            "Respondents can provide feedback without revealing their identity. You'll receive notifications when new feedback comes in, all while maintaining complete anonymity for your respondents.",
      },
   ];

   const features = [
      {
         title: "100% Anonymous",
         description: "We never track or store identifying information about respondents",
         icon: <Shield className="h-6 w-6 text-purple-400" />,
      },
      {
         title: "No Account Needed",
         description: "People can give feedback without creating an account",
         icon: <Users className="h-6 w-6 text-purple-400" />,
      },
      {
         title: "Organized Feedback",
         description: "All your feedback is organized in one easy-to-access dashboard",
         icon: <BarChart3 className="h-6 w-6 text-purple-400" />,
      },
      {
         title: "Notification System",
         description: "Get notified when you receive new feedback",
         icon: <Mail className="h-6 w-6 text-purple-400" />,
      },
   ];

   return (
      <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
         {/* Header */}
         <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md py-4 shadow-xl">
            <div className="container mx-auto px-4 md:px-6 flex justify-between items-center">
               <div className="flex items-center space-x-2">
                  <MessageSquare className="h-8 w-8 text-purple-400" />
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                     TrueFeedback
                  </span>
               </div>

               <div className="flex items-center space-x-4">
                  <Button asChild variant="ghost" className="text-white hover:text-purple-300 hover:bg-slate-800/50">
                     <Link href="/">Home</Link>
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
         <main className="flex-grow container mx-auto px-4 md:px-24 py-12">
            {/* Hero Section */}
            <section className="text-center mb-16 md:mb-20 max-w-3xl mx-auto">
               <h1 className="text-4xl md:text-5xl font-bold mb-6">
                  How{" "}
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                     TrueFeedback
                  </span>{" "}
                  Works
               </h1>
               <p className="text-lg md:text-xl text-slate-300">
                  Getting honest feedback has never been easier. Our simple process ensures you receive completely
                  anonymous feedback from anyone you choose.
               </p>
            </section>

            {/* Steps Section */}
            <section className="mb-20">
               <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
                  {steps.map((step) => (
                     <div
                        key={step.id}
                        className={`p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                           activeStep === step.id
                              ? "bg-gradient-to-b from-purple-600 to-pink-600 shadow-lg transform -translate-y-2"
                              : "bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 hover:border-purple-500/30"
                        }`}
                        onClick={() => setActiveStep(step.id)}
                     >
                        <div
                           className={`flex items-center justify-center h-16 w-16 rounded-full mb-4 ${
                              activeStep === step.id ? "bg-white/20" : "bg-purple-500/10"
                           }`}
                        >
                           <div className={activeStep === step.id ? "text-white" : "text-purple-400"}>{step.icon}</div>
                        </div>
                        <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                        <p className="text-slate-300">{step.description}</p>
                     </div>
                  ))}
               </div>

               {/* Step Details */}
               <div className="bg-slate-800/30 backdrop-blur-sm rounded-2xl p-8 border border-slate-700/50">
                  <div className="flex items-start">
                     <div className="flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-purple-500/10 text-purple-400 mr-6">
                        {steps.find((step) => step.id === activeStep)?.icon}
                     </div>
                     <div>
                        <h3 className="text-2xl font-bold mb-4">
                           Step {activeStep}: {steps.find((step) => step.id === activeStep)?.title}
                        </h3>
                        <p className="text-lg text-slate-300">
                           {steps.find((step) => step.id === activeStep)?.details}
                        </p>
                     </div>
                  </div>
               </div>
            </section>

            {/* Features Section */}
            <section className="mb-20">
               <h2 className="text-3xl font-bold text-center mb-12">Why Choose TrueFeedback?</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {features.map((feature, index) => (
                     <Card key={index} className="bg-slate-800/30 backdrop-blur-sm border-slate-700/50 text-center">
                        <CardHeader>
                           <div className="flex justify-center mb-4">{feature.icon}</div>
                           <CardTitle className="text-xl">{feature.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-slate-300">{feature.description}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-20">
               <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                     <h3 className="text-xl font-bold mb-4">Is it really anonymous?</h3>
                     <p className="text-slate-300">
                        Yes, absolutely. We don't collect or store any identifying information about respondents. We
                        don't track IP addresses, browser fingerprints, or any other data that could identify someone.
                     </p>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                     <h3 className="text-xl font-bold mb-4">Do people need an account to give feedback?</h3>
                     <p className="text-slate-300">
                        No, that's the beauty of our system. Anyone with your unique link can provide feedback without
                        creating an account or providing any personal information.
                     </p>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                     <h3 className="text-xl font-bold mb-4">Can I customize my feedback page?</h3>
                     <p className="text-slate-300">
                        Yes, you can add your name, photo, and specific questions you'd like people to answer. This
                        helps contextualize the feedback you receive.
                     </p>
                  </div>

                  <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
                     <h3 className="text-xl font-bold mb-4">How do I share my feedback link?</h3>
                     <p className="text-slate-300">
                        You can share your unique link through email, messaging apps, social media, or even print it on
                        physical materials. It's completely versatile.
                     </p>
                  </div>
               </div>
            </section>

            {/* CTA Section */}
            <section className="text-center">
               <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-8 md:p-12 border border-slate-700/50">
                  <h2 className="text-2xl md:text-3xl font-bold mb-6">Ready to Get Honest Feedback?</h2>
                  <p className="text-slate-300 mb-8 max-w-2xl mx-auto">
                     Join thousands of users who are improving their skills, relationships, and performance through
                     anonymous feedback.
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
                     <span className="text-lg font-bold text-white">TrueFeedback</span>
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
