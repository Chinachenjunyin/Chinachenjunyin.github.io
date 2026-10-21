import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Github, Mail, Rss, Music4 } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

const socialBtnClass =
  "w-10 h-10 rounded-xl bg-white/50 border border-white/40 shadow-sm flex items-center justify-center text-slate-700 hover:bg-indigo-500 hover:text-white transition";

export default function ProfileCard() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);
  const settings = useAppStore((s) => s.settings);

  const stats = [
    { value: articles.length, label: "文章" },
    { value: categories.length, label: "分类" },
    { value: tags.length, label: "标签" },
  ];

  return (
    <div className="lg:col-span-7 bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] p-6 md:p-8 min-h-[280px] flex flex-col justify-between">
      <div className="flex gap-6">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-tr from-indigo-500 to-purple-500 p-1 shrink-0">
          <div className="w-full h-full rounded-xl bg-white flex items-center justify-center">
            <span className="font-display font-black text-3xl text-indigo-500">
              {settings.authorName.charAt(0)}
            </span>
          </div>
        </div>
        <div className="min-w-0">
          <h1 className="font-display text-2xl md:text-3xl font-bold tracking-wider text-slate-900">
            {settings.blogTitle}
          </h1>
          <p className="text-sm md:text-base text-slate-700 font-medium line-clamp-2 mt-2">
            {settings.authorBio}
          </p>
        </div>
      </div>

      <div className="flex items-end justify-between mt-8">
        <div className="flex gap-6">
          {stats.map((item, i) => (
            <Fragment key={item.label}>
              {i > 0 && <div className="w-px h-10 bg-slate-300/50 self-center" />}
              <div className="text-center">
                <div className="text-xl font-black text-slate-900">
                  {item.value}
                </div>
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mt-1">
                  {item.label}
                </div>
              </div>
            </Fragment>
          ))}
        </div>

        <div className="flex gap-3">
          <a
            href="https://github.com/Chinachenjunyin"
            target="_blank"
            rel="noreferrer"
            className={socialBtnClass}
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <Link to="/about" className={socialBtnClass} aria-label="联系我">
            <Mail className="w-5 h-5" />
          </Link>
          <Link to="/articles" className={socialBtnClass} aria-label="全部文章">
            <Rss className="w-5 h-5" />
          </Link>
          <Link to="/" className={socialBtnClass} aria-label="音乐">
            <Music4 className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
