import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const routerBasename = import.meta.env.BASE_URL;
import MainLayout from "@/components/layout/MainLayout";
import Home from "@/pages/Home";
import { useAppStore } from "@/context/AppContext";

// 非首屏页面全部懒加载，首屏只下首页必需的代码，打开速度快很多
const ArticleList = lazy(() => import("@/pages/ArticleList"));
const ArticleDetail = lazy(() => import("@/pages/ArticleDetail"));
const About = lazy(() => import("@/pages/About"));
const AdminLayout = lazy(() => import("@/components/layout/AdminLayout"));
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminArticles = lazy(() => import("@/pages/admin/AdminArticles"));
const AdminArticleEditor = lazy(() => import("@/pages/admin/AdminArticleEditor"));
const AdminCategories = lazy(() => import("@/pages/admin/AdminCategories"));
const AdminTags = lazy(() => import("@/pages/admin/AdminTags"));
const AdminSettings = lazy(() => import("@/pages/admin/AdminSettings"));

function PageFallback() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center text-slate-400 text-sm tracking-widest">
      加载中…
    </div>
  );
}

function AppInitializer() {
  const loadData = useAppStore((s) => s.loadData);

  useEffect(() => {
    loadData();
  }, [loadData]);

  return null;
}

export default function App() {
  return (
    <Router basename={routerBasename}>
      <AppInitializer />
      <Suspense fallback={<PageFallback />}>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/articles" element={<ArticleList />} />
            <Route path="/article/:id" element={<ArticleDetail />} />
            <Route path="/about" element={<About />} />
          </Route>

          <Route path="/xiaoyu/login" element={<AdminLogin />} />
          <Route element={<AdminLayout />}>
            <Route path="/xiaoyu" element={<Navigate to="/xiaoyu/dashboard" replace />} />
            <Route path="/xiaoyu/dashboard" element={<AdminDashboard />} />
            <Route path="/xiaoyu/articles" element={<AdminArticles />} />
            <Route path="/xiaoyu/articles/new" element={<AdminArticleEditor />} />
            <Route path="/xiaoyu/articles/edit/:id" element={<AdminArticleEditor />} />
            <Route path="/xiaoyu/categories" element={<AdminCategories />} />
            <Route path="/xiaoyu/tags" element={<AdminTags />} />
            <Route path="/xiaoyu/settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}
