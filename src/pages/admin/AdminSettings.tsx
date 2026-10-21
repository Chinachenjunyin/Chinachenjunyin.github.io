import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff, Download } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function AdminSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const handleExport = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      articles,
      categories,
      tags,
      settings: {
        blogTitle: settings.blogTitle,
        blogDescription: settings.blogDescription,
        authorName: settings.authorName,
        authorBio: settings.authorBio,
      },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blog-backup-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const [blogTitle, setBlogTitle] = useState(settings.blogTitle);
  const [blogDescription, setBlogDescription] = useState(
    settings.blogDescription
  );
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [authorBio, setAuthorBio] = useState(settings.authorBio);
  const [adminPassword, setAdminPassword] = useState(settings.adminPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateSettings({
      ...settings,
      blogTitle: blogTitle.trim(),
      blogDescription: blogDescription.trim(),
      authorName: authorName.trim(),
      authorBio: authorBio.trim(),
      adminPassword: adminPassword.trim(),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="font-display text-3xl text-text tracking-wider">
        系统设置
      </h1>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-5">
        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            博客标题
          </label>
          <input
            type="text"
            value={blogTitle}
            onChange={(e) => setBlogTitle(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            博客描述
          </label>
          <input
            type="text"
            value={blogDescription}
            onChange={(e) => setBlogDescription(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            作者名称
          </label>
          <input
            type="text"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            作者简介
          </label>
          <textarea
            value={authorBio}
            onChange={(e) => setAuthorBio(e.target.value)}
            rows={3}
            className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors resize-none"
          />
        </div>

        <div>
          <label className="block text-sm text-text-muted mb-1.5">
            后台密码
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-4 py-2.5 bg-background border border-border rounded-lg text-text focus:outline-none focus:border-primary transition-colors pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        <div className="pt-2">
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all"
          >
            <Save className="w-4 h-4" />
            {saved ? "已保存" : "保存设置"}
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-xl border border-border p-6 space-y-3">
        <h2 className="text-base font-medium text-text">数据备份 / 正式发布</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          在后台发布的文章目前只保存在这台设备的浏览器里，其他人打开网站看不到。点下面按钮把全部文章导出成文件，发给小雨，就能帮你把文章正式写进网站，任何人打开都能看到。
        </p>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 px-6 py-2.5 bg-background border border-border rounded-lg text-sm text-text hover:border-primary transition-all"
        >
          <Download className="w-4 h-4" />
          导出全部文章（备份文件）
        </button>
      </div>
    </div>
  );
}
