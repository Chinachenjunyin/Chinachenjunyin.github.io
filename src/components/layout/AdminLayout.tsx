import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FileText,
  FolderOpen,
  Tags,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/context/AppContext";

const adminLinks = [
  { path: "/xiaoyu/dashboard", label: "仪表盘", icon: LayoutDashboard },
  { path: "/xiaoyu/articles", label: "文章管理", icon: FileText },
  { path: "/xiaoyu/categories", label: "分类管理", icon: FolderOpen },
  { path: "/xiaoyu/tags", label: "标签管理", icon: Tags },
  { path: "/xiaoyu/settings", label: "系统设置", icon: Settings },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const adminLoggedIn = useAppStore((s) => s.adminLoggedIn);
  const logout = useAppStore((s) => s.logout);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!adminLoggedIn) {
      navigate("/xiaoyu/login");
    }
  }, [adminLoggedIn, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!adminLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background text-text font-body flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform lg:transform-none ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link to="/" className="font-display text-xl text-text tracking-wider">
            CMS 后台
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1 text-text-muted hover:text-text"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {adminLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-muted hover:text-text hover:bg-surface-light"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2.5 w-full rounded-lg text-sm text-text-muted hover:text-primary hover:bg-primary/10 transition-all"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-surface/50 backdrop-blur-sm border-b border-border flex items-center px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 text-text-muted hover:text-text mr-2"
          >
            <Menu className="w-5 h-5" />
          </button>
          <span className="text-sm text-text-muted">
            {adminLinks.find((l) => l.path === location.pathname)?.label ||
              "后台管理"}
          </span>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
}
