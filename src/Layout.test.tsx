import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { AuthProvider } from "./auth";
import Layout from "./Layout";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <AuthProvider>
        <Layout>
          <p>Page content</p>
        </Layout>
      </AuthProvider>
    </MemoryRouter>
  );

// Seeding storage stands in for a visitor who signed in earlier and came back.
const storeSession = () =>
  window.localStorage.setItem(
    "conduit.user",
    JSON.stringify({ email: "alice@example.com", token: "jwt-token", username: "alice", bio: "", image: "" })
  );

describe("Layout", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("highlights Home on the article list", () => {
    renderAt("/");

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("active");
  });

  it("stops highlighting Home once another page is open", () => {
    renderAt("/how-to-train-your-dragon");

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("active");
  });

  it("offers signing in to a visitor", () => {
    renderAt("/");

    expect(screen.getByRole("link", { name: "Sign in" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Sign up" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: /Settings/ })).not.toBeInTheDocument();
  });

  it("links to the profile of the signed-in user instead", () => {
    storeSession();

    renderAt("/");

    expect(screen.getByRole("link", { name: /alice/ })).toHaveAttribute("href", "/profile/alice");
    expect(screen.getByRole("link", { name: /Settings/ })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Sign in" })).not.toBeInTheDocument();
  });
});
