import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Switch } from "react-router-dom";

import { getArticles, getProfile, Profile as ProfileModel, setFollow } from "./api";
import { AuthProvider } from "./auth";
import Profile from "./Profile";

jest.mock("./api");

const mockedGetProfile = getProfile as jest.MockedFunction<typeof getProfile>;
const mockedGetArticles = getArticles as jest.MockedFunction<typeof getArticles>;
const mockedSetFollow = setFollow as jest.MockedFunction<typeof setFollow>;

const profile: ProfileModel = { username: "bob", bio: "", image: "", following: false };

const storeSession = () =>
  window.localStorage.setItem(
    "conduit.user",
    JSON.stringify({ email: "alice@example.com", token: "jwt-token", username: "alice", bio: "", image: "" })
  );

const renderProfile = () =>
  render(
    <MemoryRouter initialEntries={["/profile/bob"]}>
      <AuthProvider>
        <Switch>
          <Route path="/login">Sign in page</Route>
          <Route path="/profile/:username" component={Profile} />
        </Switch>
      </AuthProvider>
    </MemoryRouter>
  );

describe("Profile", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockedGetProfile.mockReset();
    mockedGetArticles.mockReset();
    mockedSetFollow.mockReset();
    mockedGetArticles.mockResolvedValue([]);
    mockedGetProfile.mockResolvedValue(profile);
  });

  it("reads the profile with the token, otherwise the API never reports a follow", async () => {
    storeSession();

    renderProfile();

    expect(await screen.findByRole("button", { name: /Follow bob/ })).toBeInTheDocument();
    expect(mockedGetProfile).toHaveBeenCalledWith("bob", "jwt-token", expect.anything());
  });

  it("follows the author and switches the button over", async () => {
    storeSession();
    mockedSetFollow.mockResolvedValue({ ...profile, following: true });

    renderProfile();

    userEvent.click(await screen.findByRole("button", { name: /Follow bob/ }));

    expect(await screen.findByRole("button", { name: /Unfollow bob/ })).toBeInTheDocument();
    expect(mockedSetFollow).toHaveBeenCalledWith("bob", true, "jwt-token");
  });

  it("takes the opposite of the current state when unfollowing", async () => {
    storeSession();
    mockedGetProfile.mockResolvedValue({ ...profile, following: true });
    mockedSetFollow.mockResolvedValue(profile);

    renderProfile();

    userEvent.click(await screen.findByRole("button", { name: /Unfollow bob/ }));

    expect(await screen.findByRole("button", { name: /Follow bob/ })).toBeInTheDocument();
    expect(mockedSetFollow).toHaveBeenCalledWith("bob", false, "jwt-token");
  });

  it("sends a visitor to the sign in page instead of calling the API", async () => {
    renderProfile();

    userEvent.click(await screen.findByRole("button", { name: /Follow bob/ }));

    expect(await screen.findByText("Sign in page")).toBeInTheDocument();
    expect(mockedSetFollow).not.toHaveBeenCalled();
  });
});
