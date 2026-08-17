import { ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";

import { useAuth } from "./auth";
import AuthorImage from "./AuthorImage";

type LayoutProps = {
  children: ReactNode;
};

export default function Layout({ children }: LayoutProps): JSX.Element {
  const { user } = useAuth();

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* NavLink adds the "active" class the Conduit theme expects. */}
              <NavLink className="nav-link" to="/" exact>
                Home
              </NavLink>
            </li>
            {user ? (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/editor">
                    <i className="ion-compose" />
                    &nbsp;New Article
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/settings">
                    <i className="ion-gear-a" />
                    &nbsp;Settings
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to={`/profile/${user.username}`}>
                    <AuthorImage image={user.image} username={user.username} className="user-pic" />
                    {user.username}
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/login">
                    Sign in
                  </NavLink>
                </li>
                <li className="nav-item">
                  <NavLink className="nav-link" to="/register">
                    Sign up
                  </NavLink>
                </li>
              </>
            )}
          </ul>
        </div>
      </nav>

      {children}

      <footer>
        <div className="container">
          <Link to="/" className="logo-font">
            conduit
          </Link>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
