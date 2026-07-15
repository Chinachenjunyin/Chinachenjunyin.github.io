export interface Article {
  id: string;
  title: string;
  content: string;
  summary: string;
  categoryId: string;
  tagIds: string[];
  cover?: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  articleCount: number;
}

export interface Tag {
  id: string;
  name: string;
  articleCount: number;
}

export interface Setting {
  id: string;
  blogTitle: string;
  blogDescription: string;
  authorName: string;
  authorBio: string;
  adminPassword: string;
}

export interface AppState {
  articles: Article[];
  categories: Category[];
  tags: Tag[];
  settings: Setting;
}
