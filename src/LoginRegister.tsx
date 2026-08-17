import { FormEvent, useState } from "react";
import { useHistory } from "react-router-dom";

import { useAuth } from "./auth";
import Layout from "./Layout";

export default function LoginRegister(): JSX.Element {
  const { signIn } = useAuth();
  const history = useHistory();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      await signIn(email, password);
      history.push("/");
    } catch (signInError) {
      // Bad credentials come back as an empty 401 body, so the wording has to be made up here.
      setError("Email or password is invalid.");
      // Only reset on failure; a successful sign in unmounts this page straight away.
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="auth-page">
        <div className="container page">
          <div className="row">
            <div className="col-md-6 offset-md-3 col-xs-12">
              <h1 className="text-xs-center">Sign in</h1>
              <p className="text-xs-center">
                <a href="">Need an account?</a>
              </p>

              {error && (
                <ul className="error-messages">
                  <li>{error}</li>
                </ul>
              )}

              <form onSubmit={handleSubmit}>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={event => setEmail(event.target.value)}
                    required
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    className="form-control form-control-lg"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={event => setPassword(event.target.value)}
                    required
                  />
                </fieldset>
                <button className="btn btn-lg btn-primary pull-xs-right" disabled={isSubmitting}>
                  Sign in
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
