// The API runs in a separate container, so its address has to stay configurable at build time.
const apiUrl = process.env.REACT_APP_API_URL ?? "http://localhost:3000/api";

export type Profile = {
  username: string;
  bio: string;
  image: string;
  following: boolean;
};

export type Article = {
  slug: string;
  title: string;
  description: string;
  body: string;
  tagList: string[];
  createdAt: string;
  updatedAt: string;
  favorited: boolean;
  favoritesCount: number;
  author: Profile;
};

type MultipleArticlesResponse = {
  articles: Article[];
  articlesCount: number;
};

type SingleArticleResponse = {
  article: Article;
};

export type User = {
  email: string;
  token: string;
  username: string;
  bio: string;
  image: string;
};

type ProfileResponse = {
  profile: Profile;
};

type UserResponse = {
  user: User;
};

type ArticleFilter = {
  author?: string;
};

export async function getArticles(filter: ArticleFilter = {}, signal?: AbortSignal): Promise<Article[]> {
  const query = new URLSearchParams();

  if (filter.author) {
    query.set("author", filter.author);
  }

  const response = await fetch(`${apiUrl}/articles?${query}`, { signal });

  if (!response.ok) {
    throw new Error(`Could not fetch articles, the API responded with ${response.status}.`);
  }

  const { articles }: MultipleArticlesResponse = await response.json();

  return articles;
}

export async function getArticle(slug: string, signal?: AbortSignal): Promise<Article> {
  const response = await fetch(`${apiUrl}/articles/${slug}`, { signal });

  if (!response.ok) {
    throw new Error(`Could not fetch the article, the API responded with ${response.status}.`);
  }

  const { article }: SingleArticleResponse = await response.json();

  return article;
}

export async function getProfile(username: string, signal?: AbortSignal): Promise<Profile> {
  const response = await fetch(`${apiUrl}/profiles/${username}`, { signal });

  if (!response.ok) {
    throw new Error(`Could not fetch the profile, the API responded with ${response.status}.`);
  }

  const { profile }: ProfileResponse = await response.json();

  return profile;
}

export async function login(email: string, password: string): Promise<User> {
  const response = await fetch(`${apiUrl}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user: { email, password } }),
  });

  if (!response.ok) {
    throw new Error(`Could not sign in, the API responded with ${response.status}.`);
  }

  const { user }: UserResponse = await response.json();

  return user;
}
