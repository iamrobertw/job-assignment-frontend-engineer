import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { AuthProvider } from "./auth";
import Logout from "./Logout";

describe("Logout", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("drops the session and returns to the article list", async () => {
    window.localStorage.setItem(
      "conduit.user",
      JSON.stringify({ email: "alice@example.com", token: "jwt-token", username: "alice", bio: "", image: "" })
    );

    render(
      <MemoryRouter initialEntries={["/logout"]}>
        <AuthProvider>
          <Switch>
            <Route path="/logout" component={Logout} />
            <Route path="/">Article list</Route>
          </Switch>
        </AuthProvider>
      </MemoryRouter>
    );

    expect(await screen.findByText("Article list")).toBeInTheDocument();
    expect(window.localStorage.getItem("conduit.user")).toBeNull();
  });
});
