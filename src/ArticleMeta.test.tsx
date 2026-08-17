import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { Article, setFollow } from "./api";
import ArticleMeta from "./ArticleMeta";
import { AuthProvider } from "./auth";

jest.mock("./api");

const mockedSetFollow = setFollow as jest.MockedFunction<typeof setFollow>;

const article: Article = {
  slug: "how-to-train-your-dragon",
  title: "How to train your dragon",
  description: "Ever wonder how?",
  body: "It takes a Jacobian",
  tagList: [],
  createdAt: "2026-01-20T12:00:00.000Z",
  updatedAt: "2026-01-20T12:00:00.000Z",
  favorited: false,
  favoritesCount: 4,
  author: { username: "bob", bio: "", image: "", following: false },
};

const storeSession = () =>
  window.localStorage.setItem(
    "conduit.user",
    JSON.stringify({ email: "alice@example.com", token: "jwt-token", username: "alice", bio: "", image: "" })
  );

const renderMeta = (shown: Article, onFollowToggled = jest.fn()) => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Switch>
          <Route path="/login">Sign in page</Route>
          <Route path="/">
            <ArticleMeta article={shown} onFavoriteToggled={jest.fn()} onFollowToggled={onFollowToggled} />
          </Route>
        </Switch>
      </AuthProvider>
    </MemoryRouter>
  );

  return onFollowToggled;
};

describe("ArticleMeta", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedSetFollow.mockReset();
  });

  it("hands the updated author back to the page", async () => {
    storeSession();
    const author = { ...article.author, following: true };
    mockedSetFollow.mockResolvedValue(author);

    const onFollowToggled = renderMeta(article);

    userEvent.click(screen.getByRole("button", { name: /Follow bob/ }));

    await waitFor(() => expect(onFollowToggled).toHaveBeenCalledWith(author));
    expect(mockedSetFollow).toHaveBeenCalledWith("bob", true, "jwt-token");
  });

  it("takes the opposite of the current state when unfollowing", async () => {
    storeSession();
    mockedSetFollow.mockResolvedValue(article.author);

    renderMeta({ ...article, author: { ...article.author, following: true } });

    userEvent.click(screen.getByRole("button", { name: /Unfollow bob/ }));

    await waitFor(() => expect(mockedSetFollow).toHaveBeenCalledWith("bob", false, "jwt-token"));
  });

  it("sends a visitor to the sign in page instead of calling the API", async () => {
    renderMeta(article);

    userEvent.click(screen.getByRole("button", { name: /Follow bob/ }));

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(mockedSetFollow).not.toHaveBeenCalled();
  });
});
