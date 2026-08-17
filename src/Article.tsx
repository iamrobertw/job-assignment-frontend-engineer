import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Article as ArticleModel, getArticle, Profile } from "./api";
import ArticleMeta from "./ArticleMeta";
import { useAuth } from "./auth";
import Layout from "./Layout";

export default function Article(): JSX.Element {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [article, setArticle] = useState<ArticleModel | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Signing in and out changes whether the article comes back as favorited, so it is fetched again.
  useEffect(() => {
    const controller = new AbortController();

    const loadArticle = async () => {
      try {
        setArticle(await getArticle(slug, user?.token, controller.signal));
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
  }, [slug, user]);

  const handleFavoriteToggled = (updated: ArticleModel) => setArticle(updated);

  // Following returns the author alone, so it has to be merged back into the article.
  const handleFollowToggled = (author: Profile) => setArticle(current => (current ? { ...current, author } : current));

  return (
    <Layout>
      {isLoading && <div className="container page">Loading article...</div>}

      {error && <div className="container page">{error}</div>}

      {article && (
        <div className="article-page">
          <div className="banner">
            <div className="container">
              <h1>{article.title}</h1>

              <ArticleMeta
                article={article}
                onFavoriteToggled={handleFavoriteToggled}
                onFollowToggled={handleFollowToggled}
              />
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
              <ArticleMeta
                article={article}
                onFavoriteToggled={handleFavoriteToggled}
                onFollowToggled={handleFollowToggled}
              />
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
    </Layout>
  );
}
