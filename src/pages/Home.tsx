import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import HeroSection from "@/components/home/HeroSection";
import ArticleCard from "@/components/shared/ArticleCard";
import { useAppStore } from "@/context/AppContext";

export default function Home() {
  const articles = useAppStore((s) => s.articles);
  const categories = useAppStore((s) => s.categories);
  const tags = useAppStore((s) => s.tags);

  const latestArticles = articles.slice(0, 6);
  const popularTags = [...tags].sort((a, b) => b.articleCount - a.articleCount);

  return (
    <div>
      <HeroSection />

      <section id="articles" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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

      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
