import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { login, User } from "./api";
import { AuthProvider } from "./auth";
import LoginRegister from "./LoginRegister";

jest.mock("./api");

const mockedLogin = login as jest.MockedFunction<typeof login>;

const alice: User = {
  email: "alice@example.com",
  token: "jwt-token",
  username: "alice",
  bio: "I am Alice",
  image: "",
};

// The article list is replaced by a marker so the redirect can be observed without loading it.
const renderLoginPage = () =>
  render(
    <MemoryRouter initialEntries={["/login"]}>
      <AuthProvider>
        <Switch>
          <Route path="/login" component={LoginRegister} />
          <Route path="/">Article list</Route>
        </Switch>
      </AuthProvider>
    </MemoryRouter>
  );

const submitCredentials = () => {
  userEvent.type(screen.getByPlaceholderText("Email"), "alice@example.com");
  userEvent.type(screen.getByPlaceholderText("Password"), "secret");
  userEvent.click(screen.getByRole("button", { name: "Sign in" }));
};

describe("LoginRegister", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedLogin.mockReset();
  });

  it("sends the credentials and moves on to the article list", async () => {
    mockedLogin.mockResolvedValue(alice);

    renderLoginPage();
    submitCredentials();

    expect(await screen.findByText("Article list")).toBeInTheDocument();
    expect(mockedLogin).toHaveBeenCalledWith("alice@example.com", "secret");
  });

  it("stores the session so a reload stays signed in", async () => {
    mockedLogin.mockResolvedValue(alice);

    renderLoginPage();
    submitCredentials();

    await waitFor(() => expect(window.localStorage.getItem("conduit.user")).toContain("jwt-token"));
  });

  it("reports rejected credentials and stays on the page", async () => {
    mockedLogin.mockRejectedValue(new Error("The API responded with 401."));

    renderLoginPage();
    submitCredentials();

    expect(await screen.findByText("Email or password is invalid.")).toBeInTheDocument();
    expect(screen.queryByText("Article list")).not.toBeInTheDocument();
  });
});
