import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { Article, setFavorite } from "./api";
import ArticlePreview from "./ArticlePreview";
import { AuthProvider } from "./auth";

jest.mock("./api");

const mockedSetFavorite = setFavorite as jest.MockedFunction<typeof setFavorite>;

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

const renderPreview = (previewed: Article, onFavoriteToggled = jest.fn()) => {
  render(
    <MemoryRouter initialEntries={["/"]}>
      <AuthProvider>
        <Switch>
          <Route path="/login">Sign in page</Route>
          <Route path="/">
            <ArticlePreview article={previewed} onFavoriteToggled={onFavoriteToggled} />
          </Route>
        </Switch>
      </AuthProvider>
    </MemoryRouter>
  );

  return onFavoriteToggled;
};

describe("ArticlePreview", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedSetFavorite.mockReset();
  });

  it("marks an article the signed-in user has already favorited", () => {
    storeSession();

    renderPreview({ ...article, favorited: true });

    expect(screen.getByRole("button")).toHaveClass("btn-primary");
  });

  it("hands the updated article back to the list", async () => {
    storeSession();
    const updated = { ...article, favorited: true, favoritesCount: 5 };
    mockedSetFavorite.mockResolvedValue(updated);

    const onFavoriteToggled = renderPreview(article);

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(onFavoriteToggled).toHaveBeenCalledWith(updated));
    expect(mockedSetFavorite).toHaveBeenCalledWith("how-to-train-your-dragon", true, "jwt-token");
  });

  it("takes the opposite of the current state when removing a favorite", async () => {
    storeSession();
    mockedSetFavorite.mockResolvedValue(article);

    renderPreview({ ...article, favorited: true });

    userEvent.click(screen.getByRole("button"));

    await waitFor(() => expect(mockedSetFavorite).toHaveBeenCalledWith("how-to-train-your-dragon", false, "jwt-token"));
  });

  it("sends a visitor to the sign in page instead of calling the API", async () => {
    renderPreview(article);

    userEvent.click(screen.getByRole("button"));

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(mockedSetFavorite).not.toHaveBeenCalled();
  });
});
