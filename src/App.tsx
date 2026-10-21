import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

const routerBasename = import.meta.env.BASE_URL;
import MainLayout from "@/components/layout/MainLayout";
import AdminLayout from "@/components/layout/AdminLayout";
import Home from "@/pages/Home";
import ArticleList from "@/pages/ArticleList";
import ArticleDetail from "@/pages/ArticleDetail";
import About from "@/pages/About";
import AdminLogin from "@/pages/admin/AdminLogin";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminArticles from "@/pages/admin/AdminArticles";
import AdminArticleEditor from "@/pages/admin/AdminArticleEditor";
import AdminCategories from "@/pages/admin/AdminCategories";
import AdminTags from "@/pages/admin/AdminTags";
import AdminSettings from "@/pages/admin/AdminSettings";
import { useAppStore } from "@/context/AppContext";

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
    </Router>
  );
}
