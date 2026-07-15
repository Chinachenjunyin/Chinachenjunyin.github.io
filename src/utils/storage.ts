import { Article, Category, Tag, Setting } from "@/types";
import {
  defaultArticles,
  defaultCategories,
  defaultTags,
  defaultSettings,
} from "./seedData";

const KEYS = {
  articles: "blog_articles",
  categories: "blog_categories",
  tags: "blog_tags",
  settings: "blog_settings",
  adminSession: "blog_admin_session",
};

function getItem<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    if (item) {
      return JSON.parse(item) as T;
    }
  } catch {
    // ignore parse errors
  }
  return defaultValue;
}

function setItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}

export function getArticles(): Article[] {
  return getItem(KEYS.articles, defaultArticles);
}

export function saveArticles(articles: Article[]): void {
  setItem(KEYS.articles, articles);
}

export function getCategories(): Category[] {
  return getItem(KEYS.categories, defaultCategories);
}

export function saveCategories(categories: Category[]): void {
  setItem(KEYS.categories, categories);
}

export function getTags(): Tag[] {
  return getItem(KEYS.tags, defaultTags);
}

export function saveTags(tags: Tag[]): void {
  setItem(KEYS.tags, tags);
}

export function getSettings(): Setting {
  return getItem(KEYS.settings, defaultSettings);
}

export function saveSettings(settings: Setting): void {
  setItem(KEYS.settings, settings);
}

export function isAdminLoggedIn(): boolean {
  return getItem(KEYS.adminSession, false);
}

export function setAdminLoggedIn(value: boolean): void {
  setItem(KEYS.adminSession, value);
}

export function initStorage(): void {
  if (!localStorage.getItem(KEYS.articles)) {
    saveArticles(defaultArticles);
  }
  if (!localStorage.getItem(KEYS.categories)) {
    saveCategories(defaultCategories);
  }
  if (!localStorage.getItem(KEYS.tags)) {
    saveTags(defaultTags);
  }
  if (!localStorage.getItem(KEYS.settings)) {
    saveSettings(defaultSettings);
  }
}
