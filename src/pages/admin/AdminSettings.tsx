import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Eye, EyeOff } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function AdminSettings() {
  const settings = useAppStore((s) => s.settings);
  const updateSettings = useAppStore((s) => s.updateSettings);

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
    </div>
  );
}
