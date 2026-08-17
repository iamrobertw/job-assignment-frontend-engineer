import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import Layout from "./Layout";

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Layout>
        <p>Page content</p>
      </Layout>
    </MemoryRouter>
  );

describe("Layout", () => {
  it("highlights Home on the article list", () => {
    renderAt("/");

    expect(screen.getByRole("link", { name: "Home" })).toHaveClass("active");
  });

  it("stops highlighting Home once another page is open", () => {
    renderAt("/how-to-train-your-dragon");

    expect(screen.getByRole("link", { name: "Home" })).not.toHaveClass("active");
  });
});
