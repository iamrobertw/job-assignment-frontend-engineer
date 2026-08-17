import { useEffect } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./auth";
import Layout from "./Layout";

export default function Logout(): JSX.Element {
  const { signOut } = useAuth();
  const history = useHistory();

  useEffect(() => {
    signOut();
    // Replaced rather than pushed, so going back does not land here and sign out again.
    history.replace("/");
  }, [signOut, history]);

  return (
    <Layout>
      <div className="container page">Signing out...</div>
    </Layout>
  );
}
