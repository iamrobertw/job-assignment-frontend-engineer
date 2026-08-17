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

// Keep the token in a single place to avoid inconsistent auth headers.
function authHeaders(token?: string): HeadersInit {
  return token ? { Authorization: `Token ${token}` } : {};
}

export async function getArticles(
  filter: ArticleFilter = {},
  token?: string,
  signal?: AbortSignal
): Promise<Article[]> {
  const query = new URLSearchParams();

  if (filter.author) {
    query.set("author", filter.author);
  }

  // Without the token the API reports every article as not favorited.
  const response = await fetch(`${apiUrl}/articles?${query}`, { headers: authHeaders(token), signal });

  if (!response.ok) {
    throw new Error(`Could not fetch articles, the API responded with ${response.status}.`);
  }

  const { articles }: MultipleArticlesResponse = await response.json();

  return articles;
}

export async function getArticle(slug: string, token?: string, signal?: AbortSignal): Promise<Article> {
  const response = await fetch(`${apiUrl}/articles/${slug}`, { headers: authHeaders(token), signal });

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

// One function rather than two near-identical ones: the flag only picks the HTTP method,
// and call sites always pass the opposite of the current state.
export async function setFavorite(slug: string, favorited: boolean, token: string): Promise<Article> {
  const response = await fetch(`${apiUrl}/articles/${slug}/favorite`, {
    method: favorited ? "POST" : "DELETE",
    headers: authHeaders(token),
  });

  if (!response.ok) {
    throw new Error(`Could not change the favorite, the API responded with ${response.status}.`);
  }

  const { article }: SingleArticleResponse = await response.json();

  return article;
}
