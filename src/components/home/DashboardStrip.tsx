import { FileText, FolderOpen, Tags, Eye } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function DashboardStrip() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const totalViews = articles.reduce((sum, a) => sum + (a.viewCount || 0), 0);

  const stats = [
    { icon: FileText, value: articles.length, label: "文章" },
    { icon: FolderOpen, value: categories.length, label: "分类" },
    { icon: Tags, value: tags.length, label: "标签" },
    { icon: Eye, value: totalViews, label: "总浏览" },
  ];

  return (
    <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] px-6 py-5">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((item) => (
          <div key={item.label} className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-primary flex items-center justify-center shrink-0">
              <item.icon className="w-5 h-5" />
            </div>
            <div>
              <div className="font-black text-lg text-slate-900 leading-tight">
                {item.value}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-500">
                {item.label}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
