import { Article, Category, Tag, Setting } from "@/types";

export const defaultCategories: Category[] = [
  { id: "cat-1", name: "技术", color: "#FF6B35", articleCount: 3 },
  { id: "cat-2", name: "设计", color: "#00D9FF", articleCount: 2 },
  { id: "cat-3", name: "生活", color: "#A855F7", articleCount: 2 },
  { id: "cat-4", name: "随笔", color: "#22C55E", articleCount: 1 },
];

export const defaultTags: Tag[] = [
  { id: "tag-1", name: "React", articleCount: 2 },
  { id: "tag-2", name: "前端", articleCount: 3 },
  { id: "tag-3", name: "CSS", articleCount: 1 },
  { id: "tag-4", name: "UI设计", articleCount: 2 },
  { id: "tag-5", name: "动画", articleCount: 1 },
  { id: "tag-6", name: "Markdown", articleCount: 1 },
  { id: "tag-7", name: "生活感悟", articleCount: 2 },
  { id: "tag-8", name: "旅行", articleCount: 1 },
];

export const defaultSettings: Setting = {
  id: "setting-1",
  blogTitle: "记录思考",
  blogDescription: "记录技术、设计与生活的点滴",
  authorName: "博主",
  authorBio: "热爱前端开发与视觉设计的创作者，喜欢用代码构建美好的数字体验。",
  adminPassword: "123456",
};

export const defaultArticles: Article[] = [
  {
    id: "article-1",
    title: "构建现代化的 React 应用",
    summary:
      "探索如何使用 React 18、TypeScript 和 Tailwind CSS 构建高性能的现代 Web 应用，包含最佳实践和性能优化技巧。",
    content: `# 构建现代化的 React 应用

React 18 带来了许多激动人心的新特性，包括并发渲染、自动批处理和新的 Suspense 改进。本文将深入探讨如何利用这些特性构建高性能的现代 Web 应用。

## 并发渲染的优势

并发渲染是 React 18 最重要的特性之一。它允许 React 同时准备多个版本的 UI，从而实现更流畅的用户体验。

\`\`\`jsx
import { useTransition } from 'react';

function SearchResults() {
  const [isPending, startTransition] = useTransition();
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    startTransition(() => {
      setQuery(value);
    });
  };

  return (
    <div>
      <input value={query} onChange={handleChange} />
      {isPending && <span>加载中...</span>}
      <Results query={query} />
    </div>
  );
}
\`\`\`

## TypeScript 集成

TypeScript 为 React 应用提供了强大的类型安全。合理使用泛型和类型推断可以大幅提升开发效率。

## 性能优化建议

1. 使用 React.memo 避免不必要的重渲染
2. 合理使用 useMemo 和 useCallback
3. 代码分割和懒加载
4. 图片优化和懒加载

> 优秀的性能不是偶然，而是深思熟虑的设计结果。

## 总结

现代化 React 开发需要综合考虑框架特性、类型安全和性能优化。希望本文能为你的项目带来启发。`,
    categoryId: "cat-1",
    tagIds: ["tag-1", "tag-2"],
    cover:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&q=80",
    createdAt: "2024-12-15T08:00:00.000Z",
    updatedAt: "2024-12-15T08:00:00.000Z",
    viewCount: 128,
  },
  {
    id: "article-2",
    title: "Tailwind CSS 设计系统实践",
    summary:
      "从零开始搭建一套基于 Tailwind CSS 的设计系统，涵盖颜色、间距、字体和组件规范。",
    content: `# Tailwind CSS 设计系统实践

Tailwind CSS 不仅是一个工具类库，更是一种构建设计系统的方法论。本文分享如何基于 Tailwind 搭建可维护的设计系统。

## 颜色系统

定义一套协调的颜色系统是设计系统的基础。

\`\`\`javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#FF6B35',
        secondary: '#00D9FF',
        background: '#0A0A0F',
      }
    }
  }
}
\`\`\`

## 间距规范

使用 4px 基数的间距系统可以保持视觉节奏的一致性。

## 组件封装

将常用的 UI 模式封装为可复用的组件。

## 总结

好的设计系统需要在灵活性和一致性之间找到平衡。`,
    categoryId: "cat-1",
    tagIds: ["tag-2", "tag-3"],
    cover:
      "https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=800&q=80",
    createdAt: "2024-12-10T10:30:00.000Z",
    updatedAt: "2024-12-10T10:30:00.000Z",
    viewCount: 96,
  },
  {
    id: "article-3",
    title: "动效设计的艺术与科学",
    summary:
      "深入探讨 UI 动效设计的原则，从物理运动规律到情感化设计，让界面活起来。",
    content: `# 动效设计的艺术与科学

动效是现代 UI 设计不可或缺的一部分。好的动效能引导用户注意力、提供操作反馈、增强品牌个性。

## 物理运动规律

真实的物理运动具有加速和减速过程，而非匀速运动。

\`\`\`css
.smooth-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
\`\`\`

## 微交互设计

微交互是围绕单一用例的小型动画，如按钮点击、开关切换等。

## 性能考量

- 优先使用 transform 和 opacity
- 避免触发布局重排
- 使用 will-change 谨慎优化

> 动效应该像呼吸一样自然，而不是为了炫技。`,
    categoryId: "cat-2",
    tagIds: ["tag-4", "tag-5"],
    cover:
      "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=800&q=80",
    createdAt: "2024-12-05T14:00:00.000Z",
    updatedAt: "2024-12-05T14:00:00.000Z",
    viewCount: 85,
  },
  {
    id: "article-4",
    title: "Markdown 写作指南",
    summary:
      "掌握 Markdown 语法，用简洁的标记语言写出格式优美的文档和文章。",
    content: `# Markdown 写作指南

Markdown 是一种轻量级标记语言，它允许你使用易读易写的纯文本格式编写文档。

## 基础语法

### 标题

使用 # 表示标题，数量表示层级。

### 列表

- 无序列表项
- 另一个项目
  - 嵌套项目

1. 有序列表项
2. 第二个项目

### 代码

行内代码使用反引号包裹，如 \`console.log('hello')\`。

\`\`\`javascript
function greet(name) {
  return \`Hello, \${name}!\`;
}
\`\`\`

## 高级特性

| 特性 | 支持 |
|------|------|
| 表格 | 是 |
| 任务列表 | 是 |
| 脚注 | 部分 |

> Markdown 的简洁性正是它的力量所在。`,
    categoryId: "cat-1",
    tagIds: ["tag-2", "tag-6"],
    cover:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&q=80",
    createdAt: "2024-11-28T09:00:00.000Z",
    updatedAt: "2024-11-28T09:00:00.000Z",
    viewCount: 72,
  },
  {
    id: "article-5",
    title: "秋日京都游记",
    summary:
      "在枫叶最美的季节漫步京都，感受古老寺庙与现代生活的和谐交融。",
    content: `# 秋日京都游记

十一月的京都，是红叶的海洋。古老的寺庙在枫叶的映衬下，呈现出千年未曾改变的静谧之美。

## 清水寺

清晨的清水寺游人尚少，站在舞台上远眺，整个京都城笼罩在薄雾之中。

## 岚山竹林

穿过竹林小径，阳光从竹叶间洒落，形成斑驳的光影。风吹过时，竹叶沙沙作响，宛如自然的乐章。

## 美食记忆

- 抹茶冰淇淋
- 怀石料理
- 拉面小巷

> 旅行不是逃避生活，而是为了让生活不被逃避。`,
    categoryId: "cat-3",
    tagIds: ["tag-7", "tag-8"],
    cover:
      "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800&q=80",
    createdAt: "2024-11-20T16:00:00.000Z",
    updatedAt: "2024-11-20T16:00:00.000Z",
    viewCount: 156,
  },
  {
    id: "article-6",
    title: "极简主义生活笔记",
    summary:
      "减少物质负担，专注真正重要的事物。极简主义不是苦行，而是自由。",
    content: `# 极简主义生活笔记

极简主义的核心不是拥有更少，而是为真正重要的事物留出空间。

## 物质减法

清理衣橱时问自己：这件物品是否在过去一年里给我带来过快乐？

## 数字极简

- 卸载不常用的应用
- 关闭非必要的通知
- 定期清理相册

## 注意力管理

我们的注意力是最宝贵的资源。减少碎片信息的干扰，才能深度思考。

> 少即是多，慢即是快。`,
    categoryId: "cat-3",
    tagIds: ["tag-7"],
    cover:
      "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?w=800&q=80",
    createdAt: "2024-11-15T11:00:00.000Z",
    updatedAt: "2024-11-15T11:00:00.000Z",
    viewCount: 203,
  },
  {
    id: "article-7",
    title: "色彩心理学在 UI 中的应用",
    summary:
      "了解颜色如何影响用户情绪和行为，用色彩讲述品牌故事。",
    content: `# 色彩心理学在 UI 中的应用

颜色不仅是视觉元素，更是情感的语言。合理的色彩运用可以引导用户行为、传达品牌个性。

## 暖色调

橙色和红色激发活力和紧迫感，适合行动按钮和促销元素。

## 冷色调

蓝色和青色传递信任和专业，适合科技和金融类产品。

## 对比与层次

高对比度引导注意力，低对比度营造柔和氛围。合理运用对比建立信息层次。

\`\`\`css
.primary-btn {
  background: linear-gradient(135deg, #FF6B35, #FF8F5A);
  color: white;
}
\`\`\`

> 色彩是直接影响灵魂的力量。`,
    categoryId: "cat-2",
    tagIds: ["tag-4"],
    cover:
      "https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&q=80",
    createdAt: "2024-11-10T13:00:00.000Z",
    updatedAt: "2024-11-10T13:00:00.000Z",
    viewCount: 89,
  },
  {
    id: "article-8",
    title: "深夜咖啡与代码",
    summary:
      "关于程序员夜猫子生活的随想，在寂静的深夜里与代码对话的独特体验。",
    content: `# 深夜咖啡与代码

凌晨两点的城市已经沉睡，只有屏幕的光亮和咖啡的香气陪伴着我。

## 深夜的专注力

白天的喧嚣被隔绝在外，深夜的宁静让思维变得异常清晰。复杂的问题在夜深人静时往往迎刃而解。

## 咖啡的仪式

手冲咖啡的过程本身就是一种冥想。看着热水缓缓浸润咖啡粉，香气逐渐弥漫开来。

## 代码即诗歌

优雅的代码和优美的诗歌一样，需要反复推敲每一个字符的位置。

> 每一个成功的程序背后，都有无数个与咖啡相伴的深夜。`,
    categoryId: "cat-4",
    tagIds: ["tag-7"],
    cover:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80",
    createdAt: "2024-11-01T20:00:00.000Z",
    updatedAt: "2024-11-01T20:00:00.000Z",
    viewCount: 178,
  },
];
