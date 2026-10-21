import { Github, Twitter, Mail } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function Footer() {
  const settings = useAppStore((s) => s.settings);

  return (
    <footer className="bg-white/50 backdrop-blur-xl border-t border-white/40 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display font-black text-2xl text-slate-800 tracking-wide">
              {settings.blogTitle}
            </h3>
            <p className="text-slate-500 text-sm mt-1">
              {settings.blogDescription}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-md flex items-center justify-center text-slate-500 hover:text-secondary hover:border-secondary/50 transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-white/60 backdrop-blur border border-white/50 shadow-md flex items-center justify-center text-slate-500 hover:text-primary hover:border-primary/40 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-white/40 text-center">
          <p className="text-slate-500 text-xs">
            &copy; {new Date().getFullYear()} {settings.authorName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
