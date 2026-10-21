import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
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
    <header className="fixed top-0 inset-x-0 z-40 bg-white/40 backdrop-blur-xl border-b border-white/30">
      <div className="w-[92%] max-w-6xl mx-auto h-16 flex items-center justify-between px-2">
        <Link
          to="/"
          className="font-display font-black text-xl tracking-tighter text-slate-800"
        >
          {settings.blogTitle}
          <span className="text-indigo-500">.</span>
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-bold">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`relative pb-1 transition-colors ${
                isActive(link.path)
                  ? "text-slate-900"
                  : "text-slate-500 hover:text-slate-800"
              }`}
            >
              {link.label}
              {isActive(link.path) && (
                <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
              )}
            </Link>
          ))}
        </nav>

        <button
          className="md:hidden p-2 text-slate-500 hover:text-slate-800"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="打开菜单"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden w-[92%] max-w-6xl mx-auto pb-3"
          >
            <div className="mt-2 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
              <div className="py-2 flex flex-col">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center px-5 py-3 text-sm font-bold transition-colors ${
                      isActive(link.path)
                        ? "text-slate-900"
                        : "text-slate-500 hover:text-slate-800"
                    }`}
                  >
                    {isActive(link.path) && (
                      <span className="mr-2 w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                    )}
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
