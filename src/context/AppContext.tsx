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
  },

  addArticle: (article) => {
    const articles = [article, ...get().articles];
    saveArticles(articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  updateArticle: (article) => {
    const articles = get().articles.map((a) =>
      a.id === article.id ? article : a
    );
    saveArticles(articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  deleteArticle: (id) => {
    const articles = get().articles.filter((a) => a.id !== id);
    saveArticles(articles);
    const counts = recalcCounts(articles, get().categories, get().tags);
    set({ articles, categories: counts.categories, tags: counts.tags });
  },

  addCategory: (category) => {
    const categories = [...get().categories, category];
    saveCategories(categories);
    set({ categories });
  },

  updateCategory: (category) => {
    const categories = get().categories.map((c) =>
      c.id === category.id ? category : c
    );
    saveCategories(categories);
    set({ categories });
  },

  deleteCategory: (id) => {
    const categories = get().categories.filter((c) => c.id !== id);
    saveCategories(categories);
    set({ categories });
  },

  addTag: (tag) => {
    const tags = [...get().tags, tag];
    saveTags(tags);
    set({ tags });
  },

  updateTag: (tag) => {
    const tags = get().tags.map((t) => (t.id === tag.id ? tag : t));
    saveTags(tags);
    set({ tags });
  },

  deleteTag: (id) => {
    const tags = get().tags.filter((t) => t.id !== id);
    saveTags(tags);
    set({ tags });
  },

  updateSettings: (settings) => {
    saveSettings(settings);
    set({ settings });
  },

  login: () => {
    setAdminLoggedIn(true);
    set({ adminLoggedIn: true });
  },

  logout: () => {
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
