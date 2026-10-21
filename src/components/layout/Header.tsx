import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, PenTool } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

const navLinks = [
  { path: "/", label: "首页" },
  { path: "/articles", label: "文章" },
  { path: "/about", label: "关于" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const settings = useAppStore((s) => s.settings);

  const isActive = (path: string) => {
    if (path === "/") return location.pathname === "/";
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto rounded-full bg-white/70 backdrop-blur-xl border border-white/50 shadow-lg shadow-indigo-500/5 px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-md shadow-primary/30 group-hover:animate-pulse-glow transition-all">
              <PenTool className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-black text-xl tracking-wide text-slate-900 group-hover:text-primary transition-colors">
              {settings.blogTitle}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? "text-primary"
                    : "text-text-muted hover:text-text"
                }`}
              >
                {link.label}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="header-active"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <button
            className="md:hidden p-2 text-text-muted hover:text-text"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden max-w-6xl mx-auto mt-2 rounded-3xl bg-white/75 backdrop-blur-xl border border-white/50 shadow-xl shadow-indigo-500/10 overflow-hidden"
          >
            <div className="px-5 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`block text-sm font-medium ${
                    isActive(link.path) ? "text-primary" : "text-text-muted"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
