import { createContext, ReactNode, useContext, useState } from "react";

import { login, User } from "./api";

// The API expects the token in an Authorization header, so it has to be readable from JavaScript.
// That rules out an httpOnly cookie and accepts the XSS exposure that comes with local storage.
const storageKey = "conduit.user";

function readStoredUser(): User | null {
  const stored = window.localStorage.getItem(storageKey);

  if (!stored) {
    return null;
  }

  try {
    return JSON.parse(stored);
  } catch (parseError) {
    // Local storage is editable by hand, and a broken entry would otherwise break every page load.
    window.localStorage.removeItem(storageKey);

    return null;
  }
}

type AuthContextValue = {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps): JSX.Element {
  const [user, setUser] = useState<User | null>(readStoredUser);

  const signIn = async (email: string, password: string) => {
    const signedInUser = await login(email, password);

    window.localStorage.setItem(storageKey, JSON.stringify(signedInUser));
    setUser(signedInUser);
  };

  return <AuthContext.Provider value={{ user, signIn }}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth has to be called inside AuthProvider.");
  }

  return context;
}
