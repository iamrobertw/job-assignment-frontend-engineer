import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Article as ArticleModel, getArticle } from "./api";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

export default function Article(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadArticle = async () => {
      try {
        setArticle(await getArticle(slug, controller.signal));
      } catch (fetchError) {
        // Aborting on unmount rejects the request as well, but then there is nobody left to inform.
        if (!controller.signal.aborted) {
          setError("Could not load the article. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadArticle();

    return () => controller.abort();
  }, [slug]);

  return (
    <>
      <nav className="navbar navbar-light">
        <div className="container">
          <a className="navbar-brand" href="/#">
            conduit
          </a>
          <ul className="nav navbar-nav pull-xs-right">
            <li className="nav-item">
              {/* Add "active" class when you're on that page" */}
              <a className="nav-link active" href="/#">
                Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/editor">
                <i className="ion-compose" />
                &nbsp;New Article
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/settings">
                <i className="ion-gear-a" />
                &nbsp;Settings
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/login">
                Sign in
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="/#/register">
                Sign up
              </a>
            </li>
          </ul>
        </div>
      </nav>

      {isLoading && <div className="container page">Loading article...</div>}

      {error && <div className="container page">{error}</div>}

      {article && (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article.title}</h1>

              <div className="article-meta">
                <Link to={`/profile/${article.author.username}`}>
                  <AuthorImage image={article.author.image} username={article.author.username} />
                </Link>
                <div className="info">
                  <Link to={`/profile/${article.author.username}`} className="author">
                    {article.author.username}
                  </Link>
                  <time className="date" dateTime={article.createdAt}>
                    {formatDate(article.createdAt)}
                  </time>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-plus-round" />
                  &nbsp; Follow {article.author.username}
                </button>
                &nbsp;&nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart" />
                  &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
                </button>
              </div>
            </div>
          </div>

          <div className="container page">
            <div className="row article-content">
              <div className="col-md-12">
                {/* The body is Markdown; splitting on blank lines at least keeps the paragraphs apart. */}
                {article.body.split("\n\n").map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            <hr />

            <div className="article-actions">
              <div className="article-meta">
                <Link to={`/profile/${article.author.username}`}>
                  <AuthorImage image={article.author.image} username={article.author.username} />
                </Link>
                <div className="info">
                  <Link to={`/profile/${article.author.username}`} className="author">
                    {article.author.username}
                  </Link>
                  <time className="date" dateTime={article.createdAt}>
                    {formatDate(article.createdAt)}
                  </time>
                </div>
                <button className="btn btn-sm btn-outline-secondary">
                  <i className="ion-plus-round" />
                  &nbsp; Follow {article.author.username}
                </button>
                &nbsp;
                <button className="btn btn-sm btn-outline-primary">
                  <i className="ion-heart" />
                  &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
                </button>
              </div>
            </div>

            <div className="row">
              <div className="col-xs-12 col-md-8 offset-md-2">
                <form className="card comment-form">
                  <div className="card-block">
                    <textarea className="form-control" placeholder="Write a comment..." rows={3} />
                  </div>
                  <div className="card-footer">
                    <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                    <button className="btn btn-sm btn-primary">Post Comment</button>
                  </div>
                </form>

                <div className="card">
                  <div className="card-block">
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  </div>
                  <div className="card-footer">
                    <a href="/#/profile/jacobschmidt" className="comment-author">
                      <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                    </a>
                    &nbsp;
                    <a href="/#/profile/jacobschmidt" className="comment-author">
                      Jacob Schmidt
                    </a>
                    <span className="date-posted">Dec 29th</span>
                  </div>
                </div>

                <div className="card">
                  <div className="card-block">
                    <p className="card-text">With supporting text below as a natural lead-in to additional content.</p>
                  </div>
                  <div className="card-footer">
                    <a href="/#/profile/jacobschmidt" className="comment-author">
                      <img src="http://i.imgur.com/Qr71crq.jpg" className="comment-author-img" />
                    </a>
                    &nbsp;
                    <a href="/#/profile/jacobschmidt" className="comment-author">
                      Jacob Schmidt
                    </a>
                    <span className="date-posted">Dec 29th</span>
                    <span className="mod-options">
                      <i className="ion-edit" />
                      <i className="ion-trash-a" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer>
        <div className="container">
          <a href="/#" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </>
  );
}
