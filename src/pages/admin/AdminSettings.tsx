import { useState } from "react";
import { motion } from "framer-motion";
import { Save, Download, Upload } from "lucide-react";
import { useAppStore } from "@/context/AppContext";
import {
  cloudConfigured,
  getCloudSession,
  pushCollection,
  stripSettingsForCloud,
} from "@/utils/cloud";

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

  const handleUploadToCloud = async () => {
    if (!getCloudSession()) {
      setSyncState("nologin");
      return;
    }
    setSyncState("busy");
    const results = await Promise.all([
      pushCollection("articles", articles),
      pushCollection("categories", categories),
      pushCollection("tags", tags),
      pushCollection("settings", stripSettingsForCloud(settings)),
    ]);
    setSyncState(results.every(Boolean) ? "done" : "error");
  };

  const [blogTitle, setBlogTitle] = useState(settings.blogTitle);
  const [blogDescription, setBlogDescription] = useState(
    settings.blogDescription
  );
  const [authorName, setAuthorName] = useState(settings.authorName);
  const [authorBio, setAuthorBio] = useState(settings.authorBio);
  const [saved, setSaved] = useState(false);
  const [syncState, setSyncState] = useState<
    "idle" | "busy" | "done" | "error" | "nologin"
  >("idle");
  const cloudReady = cloudConfigured();
  const cloudEmail = getCloudSession()?.email;

  const handleSave = () => {
    updateSettings({
      ...settings,
      blogTitle: blogTitle.trim(),
      blogDescription: blogDescription.trim(),
      authorName: authorName.trim(),
      authorBio: authorBio.trim(),
      adminPassword: settings.adminPassword,
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

        <p className="text-xs text-text-muted leading-relaxed">
          后台登录已改为管理员邮箱 + 密码（云端账号），这里不再改密码；要改密码找小雨帮你重置。
        </p>

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
        <h2 className="text-base font-medium text-text">云端同步</h2>
        <p className="text-sm text-text-muted leading-relaxed">
          {cloudReady
            ? cloudEmail
              ? `已登录云端账号：${cloudEmail}。在后台新发、修改、删除文章都会自动同步到云端，任何人打开网站都能看到。`
              : "还没登录云端账号：请先退出后台，用管理员邮箱 + 密码重新登录，之后发文才会自动同步。"
            : "云端还没配置好，先联系小雨。"}
        </p>
        <p className="text-sm text-text-muted leading-relaxed">
          以前发的文章只存在这台手机里，第一次点下面按钮把它们全部上传到云端，只需传这一次。
        </p>
        <button
          onClick={handleUploadToCloud}
          disabled={syncState === "busy" || !cloudReady}
          className="flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-sm font-medium hover:shadow-[0_0_20px_rgba(255,107,53,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Upload className="w-4 h-4" />
          {syncState === "busy" ? "上传中…" : "把本机文章上传到云端"}
        </button>
        {syncState === "done" && (
          <p className="text-sm text-emerald-500">上传完成，现在所有人都能看到这些文章了。</p>
        )}
        {syncState === "error" && (
          <p className="text-sm text-primary">上传失败，检查网络后再点一次。</p>
        )}
        {syncState === "nologin" && (
          <p className="text-sm text-primary">还没登录云端账号：先退出后台，用管理员邮箱 + 密码重新登录再来上传。</p>
        )}
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
