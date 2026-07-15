import { Github, Twitter, Mail } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function Footer() {
  const settings = useAppStore((s) => s.settings);

  return (
    <footer className="bg-surface border-t border-border mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h3 className="font-display text-2xl text-text tracking-wider">
              {settings.blogTitle}
            </h3>
            <p className="text-text-muted text-sm mt-1">
              {settings.blogDescription}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-muted hover:text-secondary hover:bg-secondary/10 transition-all"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="#"
              className="w-10 h-10 rounded-full bg-surface-light flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center">
          <p className="text-text-muted text-xs">
            &copy; {new Date().getFullYear()} {settings.authorName}. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
