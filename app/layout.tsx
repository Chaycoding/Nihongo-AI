import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BookOpen, Menu } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Nihongo AI | Professional Japanese Tutor",
  description: "Master Japanese grammar and nuance with instant AI feedback.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 flex flex-col min-h-screen`}>
        
        {/* Navigation Bar */}
        <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 z-50">
          <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight text-slate-800">
              <div className="bg-slate-800 p-1.5 rounded-lg">
                <BookOpen className="w-5 h-5 text-slate-100" />
              </div>
              Nihongo<span className="text-slate-400">AI</span>
            </div>
            
            {/* <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-500">
              <a href="#" className="hover:text-slate-900 transition-colors">Practice</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Grammar Guide</a>
              <a href="#" className="hover:text-slate-900 transition-colors">Vocabulary</a>
            </div> */}

            <div className="flex items-center gap-4">
         
              <button className="md:hidden text-slate-600">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <main className="flex-grow pt-16">
          {children}
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-slate-200 py-8 mt-12">
          <div className="max-w-5xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>© 2026 Nihongo AI. Built with Next.js.</p>
          </div>
        </footer>

      </body>
    </html>
  );
}