import { render, screen } from "@testing-library/react";

import AuthorImage from "./AuthorImage";
import avatarPlaceholder from "./avatar-placeholder.svg";

describe("AuthorImage", () => {
  it("shows the picture provided by the API", () => {
    render(<AuthorImage image="https://example.com/alice.png" username="alice" />);

    expect(screen.getByAltText("alice")).toHaveAttribute("src", "https://example.com/alice.png");
  });

  it("falls back to the placeholder when the author has no picture", () => {
    render(<AuthorImage image="" username="alice" />);

    expect(screen.getByAltText("alice")).toHaveAttribute("src", avatarPlaceholder);
  });

  it("passes the class name through so it can be styled per page", () => {
    render(<AuthorImage image="" username="alice" className="user-img" />);

    expect(screen.getByAltText("alice")).toHaveClass("user-img");
  });
});
