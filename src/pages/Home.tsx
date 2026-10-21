import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { format } from "date-fns";
import HomeSearch from "@/components/home/HomeSearch";
import ProfileCard from "@/components/home/ProfileCard";
import HomePlayer from "@/components/home/HomePlayer";
import LyricBar from "@/components/home/LyricBar";
import PostsCarousel from "@/components/home/PostsCarousel";
import ClockCard from "@/components/home/ClockCard";
import DashboardStrip from "@/components/home/DashboardStrip";
import ArticleCard from "@/components/shared/ArticleCard";
import { useAppStore } from "@/context/AppContext";

export default function Home() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const sorted = [...articles].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const featured = sorted[0];
  const latestArticles = sorted.slice(0, 6);
  const popularTags = [...tags].sort((a, b) => b.articleCount - a.articleCount);

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 flex flex-col gap-6">
      <HomeSearch />

      {/* 第一行：个人卡 + 音乐卡 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <ProfileCard />
        <HomePlayer />
      </div>

      <LyricBar />

      {/* 第二行：轮播 + 海报/动态/时钟 */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <PostsCarousel />

        <div className="lg:col-span-8 flex flex-col gap-6">
          {featured && (
            <Link
              to={`/article/${featured.id}`}
              className="relative rounded-3xl overflow-hidden min-h-[220px] group block shadow-xl border border-white/40"
            >
              <img
                src={featured.cover || "/bg.jpg"}
                alt={featured.title}
                className="absolute inset-0 w-full h-full object-cover transition duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition" />
              <div className="absolute bottom-5 left-5 right-5">
                <h3 className="text-2xl sm:text-3xl font-bold text-white underline decoration-pink-400 underline-offset-4">
                  {featured.title}
                </h3>
                <p className="text-white/90 line-clamp-1 mt-2">
                  {featured.summary}
                </p>
              </div>
            </Link>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white/40 backdrop-blur-md border border-white/40 shadow-xl rounded-3xl transition duration-500 hover:scale-[1.01] sm:col-span-2 p-5 min-h-[200px]">
              <h3 className="font-display font-bold text-slate-900 mb-3">
                最新动态
              </h3>
              <div>
                {sorted.slice(0, 4).map((article) => (
                  <Link
                    key={article.id}
                    to={`/article/${article.id}`}
                    className="flex items-baseline gap-3 py-2 border-b border-white/40 last:border-0"
                  >
                    <span className="text-xs text-text-muted shrink-0">
                      {format(new Date(article.createdAt), "MM-dd")}
                    </span>
                    <span className="text-sm truncate text-slate-700 hover:text-primary transition-colors">
                      {article.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            <ClockCard />
          </div>
        </div>
      </div>

      <DashboardStrip />

      {/* 最新文章 */}
      <section id="articles" className="pt-10">
        <div className="flex items-end justify-between mb-10">
          <div>
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-wide"
            >
              最新文章
            </motion.h2>
            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="h-1 w-20 bg-primary mt-3 origin-left"
            />
          </div>
          <Link
            to="/articles"
            className="text-sm text-text-muted hover:text-primary transition-colors"
          >
            查看全部 &rarr;
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestArticles.map((article, index) => {
            const category = categories.find(
              (c) => c.id === article.categoryId
            );
            const articleTags = tags.filter((t) =>
              article.tagIds.includes(t.id)
            );
            return (
              <ArticleCard
                key={article.id}
                article={article}
                category={category}
                tags={articleTags}
                index={index}
              />
            );
          })}
        </div>
      </section>

      {/* 热门标签 */}
      <section className="py-10">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="font-display font-black text-4xl md:text-5xl text-slate-900 tracking-wide mb-10"
        >
          热门标签
        </motion.h2>

        <div className="flex flex-wrap gap-3">
          {popularTags.map((tag, index) => (
            <motion.div
              key={tag.id}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.2 }}
            >
              <Link
                to={`/articles?tag=${tag.id}`}
                className="inline-block px-4 py-2 rounded-full bg-white/50 backdrop-blur border border-white/50 shadow-md shadow-indigo-500/5 text-text hover:border-primary/50 hover:text-primary transition-all"
                style={{
                  fontSize: `${Math.max(0.75, Math.min(1.25, 0.75 + tag.articleCount * 0.1))}rem`,
                }}
              >
                {tag.name}
                <span className="ml-1.5 text-text-muted text-xs">
                  {tag.articleCount}
                </span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
