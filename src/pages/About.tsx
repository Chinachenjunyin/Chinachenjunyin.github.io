import { motion } from "framer-motion";
import { PenTool, Code, Palette, Coffee } from "lucide-react";
import { useAppStore } from "@/context/AppContext";

export default function About() {
  const settings = useAppStore((s) => s.settings);

  const skills = [
    { icon: Code, label: "前端开发", desc: "React / Vue / TypeScript" },
    { icon: Palette, label: "UI 设计", desc: "Figma / Tailwind CSS" },
    { icon: PenTool, label: "内容创作", desc: "Markdown / 技术写作" },
    { icon: Coffee, label: "咖啡鉴赏", desc: "手冲 / 意式 / 冷萃" },
  ];

  return (
    <div className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <span className="font-display text-4xl text-white">
            {settings.authorName.charAt(0)}
          </span>
        </div>
        <h1 className="font-display text-5xl md:text-6xl text-text tracking-wider mb-4">
          {settings.authorName}
        </h1>
        <p className="text-lg text-text-muted max-w-2xl mx-auto">
          {settings.authorBio}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-16"
      >
        {skills.map((skill, index) => (
          <motion.div
            key={skill.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
            className="p-6 bg-surface rounded-lg border border-border hover:border-primary/50 transition-all"
          >
            <skill.icon className="w-8 h-8 text-primary mb-3" />
            <h3 className="text-text font-bold mb-1">{skill.label}</h3>
            <p className="text-sm text-text-muted">{skill.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
        className="bg-surface rounded-lg border border-border p-8 text-center"
      >
        <h2 className="font-display text-3xl text-text tracking-wider mb-4">
          关于博客
        </h2>
        <p className="text-text-muted leading-relaxed max-w-2xl mx-auto">
          {settings.blogDescription}。这个博客使用 React 18、TypeScript 和
          Tailwind CSS 构建，采用纯前端架构，所有数据通过 LocalStorage
          本地持久化。这是一个开源的学习项目，展示了现代 Web
          开发的最佳实践。
        </p>
      </motion.div>
    </div>
  );
}
