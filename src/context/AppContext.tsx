import { create } from "zustand";
import { Article, Category, Tag, Setting } from "@/types";
import {
  getArticles,
  getCategories,
  getTags,
  getSettings,
  saveArticles,
  saveCategories,
  saveTags,
  saveSettings,
  isAdminLoggedIn,
  setAdminLoggedIn,
  initStorage,
} from "@/utils/storage";
import {
  cloudConfigured,
  fetchCloudCollections,
  getCloudSession,
  isCloudSynced,
  pushCollection,
  clearCloudSession,
  stripSettingsForCloud,
} from "@/utils/cloud";

// 管理员已登录云端时，把整组数据顺手同步上去（访客打开网站读的就是云端这份）
function pushIfAdmin(key: string, value: unknown): void {
  if (!cloudConfigured() || !getCloudSession()) return;
  void pushCollection(key, value);
}

interface AppStore {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  settings: Setting;
  adminLoggedIn: boolean;

  // Actions
  loadData: () => void;
  addArticle: (article: Article) => void;
  updateArticle: (article: Article) => void;
  deleteArticle: (id: string) => void;
  addCategory: (category: Category) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (id: string) => void;
  addTag: (tag: Tag) => void;
  updateTag: (tag: Tag) => void;
  deleteTag: (id: string) => void;
  updateSettings: (settings: Setting) => void;
  login: () => void;
  logout: () => void;
  refreshCounts: () => void;
}

function recalcCounts(
  articles: Article[],
  categories: Category[],
  tags: Tag[]
): { categories: Category[]; tags: Tag[] } {
  const catCounts = new Map<string, number>();
  const tagCounts = new Map<string, number>();

  for (const a of articles) {
    catCounts.set(a.categoryId, (catCounts.get(a.categoryId) || 0) + 1);
    for (const tid of a.tagIds) {
      tagCounts.set(tid, (tagCounts.get(tid) || 0) + 1);
    }
  }

  return {
    categories: categories.map((c) => ({
      ...c,
      articleCount: catCounts.get(c.id) || 0,
    })),
    tags: tags.map((t) => ({ ...t, articleCount: tagCounts.get(t.id) || 0 })),
  };
}

export const useAppStore = create<AppStore>((set, get) => ({
  articles: [],
  categories: [],
  tags: [],
  settings: getSettings(),
  adminLoggedIn: isAdminLoggedIn(),

  loadData: () => {
    initStorage();
    const articles = getArticles();
    const categories = getCategories();
    const tags = getTags();
    const settings = getSettings();
    const counts = recalcCounts(articles, categories, tags);
    set({
      articles,
      categories: counts.categories,
      tags: counts.tags,
      settings,
      adminLoggedIn: isAdminLoggedIn(),
    });

    // 再从云端拉一次最新数据覆盖本地（云端才是全网看到的那一份）。
    // 例外：管理员本机还有没上传过的文章时（未同步标记），不覆盖本机，防丢稿。
    void fetchCloudCollections().then((map) => {
      if (!map) return;
      const hasData = ["articles", "categories", "tags", "settings"].some(
        (k) => k in map
      );
      if (!hasData) return;
      if (getCloudSession() && !isCloudSynced()) return;

      const local = get();
      const nextArticles = Array.isArray(map.articles)
        ? (map.articles as Article[])
        : local.articles;
      const nextCategories = Array.isArray(map.categories)
        ? (map.categories as Category[])
        : local.categories;
      const nextTags = Array.isArray(map.tags)
        ? (map.tags as Tag[])
        : local.tags;
      let nextSettings = local.settings;
      if (map.settings && typeof map.settings === "object") {
        // 云端设置不含密码字段，密码仍以本机为准
        nextSettings = {
          ...(map.settings as Setting),
          adminPassword: local.settings.adminPassword,
        };
      }

      saveArticles(nextArticles);
      saveCategories(nextCategories);
      saveTags(nextTags);
      saveSettings(nextSettings);
      const c = recalcCounts(nextArticles, nextCategories, nextTags);
      set({
        articles: nextArticles,
        categories: c.categories,
        tags: c.tags,
        settings: nextSettings,
      });
    });
  },

  addArticle: (article) => {
    const articles = [article, ...get().articles];
    saveArticles(articles);
    pushIfAdmin("articles", articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  updateArticle: (article) => {
    const articles = get().articles.map((a) =>
      a.id === article.id ? article : a
    );
    saveArticles(articles);
    pushIfAdmin("articles", articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  deleteArticle: (id) => {
    const articles = get().articles.filter((a) => a.id !== id);
    saveArticles(articles);
    pushIfAdmin("articles", articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  addCategory: (category) => {
    const categories = [...get().categories, category];
    saveCategories(categories);
    pushIfAdmin("categories", categories);
    set({ categories });
  },

  updateCategory: (category) => {
    const categories = get().categories.map((c) =>
      c.id === category.id ? category : c
    );
    saveCategories(categories);
    pushIfAdmin("categories", categories);
    set({ categories });
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter((c) => c.id !== id);
    saveCategories(categories);
    pushIfAdmin("categories", categories);
    set({ categories });
  },

  addTag: (tag) => {
    const tags = [...get().tags, tag];
    saveTags(tags);
    pushIfAdmin("tags", tags);
    set({ tags });
  },

  updateTag: (tag) => {
    const tags = get().tags.map((t) => (t.id === tag.id ? tag : t));
    saveTags(tags);
    pushIfAdmin("tags", tags);
    set({ tags });
  },

  deleteTag: (id) => {
    const tags = get().tags.filter((t) => t.id !== id);
    saveTags(tags);
    pushIfAdmin("tags", tags);
    set({ tags });
  },

  updateSettings: (settings) => {
    saveSettings(settings);
    pushIfAdmin("settings", stripSettingsForCloud(settings));
    set({ settings });
  },

  login: () => {
    setAdminLoggedIn(true);
    set({ adminLoggedIn: true });
  },

  logout: () => {
    clearCloudSession();
    setAdminLoggedIn(false);
    set({ adminLoggedIn: false });
  },

  refreshCounts: () => {
    const counts = recalcCounts(
      get().articles,
      get().categories,
      get().tags
    );
    set({ categories: counts.categories, tags: counts.tags });
  },
}));
