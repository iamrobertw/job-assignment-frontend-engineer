import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { Article, getArticles, getProfile, Profile as ProfileModel } from "./api";
import ArticlePreview from "./ArticlePreview";
import AuthorImage from "./AuthorImage";
import Layout from "./Layout";

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const loadPage = async () => {
      try {
        // The page needs both resources anyway, so they travel in parallel rather than one after another.
        const [loadedProfile, loadedArticles] = await Promise.all([
          getProfile(username, controller.signal),
          getArticles({ author: username }, controller.signal),
        ]);

        setProfile(loadedProfile);
        setArticles(loadedArticles);
      } catch (fetchError) {
        // Aborting on unmount rejects the request as well, but then there is nobody left to inform.
        if (!controller.signal.aborted) {
          setError("Could not load the profile. Please try again later.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    loadPage();

    return () => controller.abort();
  }, [username]);

  return (
    <Layout>
      {isLoading && <div className="container page">Loading profile...</div>}

      {error && <div className="container page">{error}</div>}

      {profile && (
        <div className="profile-page">
          <div className="user-info">
            <div className="container">
              <div className="row">
                <div className="col-xs-12 col-md-10 offset-md-1">
                  <AuthorImage image={profile.image} username={profile.username} className="user-img" />
                  <h4>{profile.username}</h4>
                  <p>{profile.bio}</p>
                  <button className="btn btn-sm btn-outline-secondary action-btn">
                    <i className="ion-plus-round" />
                    &nbsp; Follow {profile.username}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="container">
            <div className="row">
              <div className="col-xs-12 col-md-10 offset-md-1">
                <div className="articles-toggle">
                  <ul className="nav nav-pills outline-active">
                    <li className="nav-item">
                      <a className="nav-link active" href="">
                        My Articles
                      </a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="">
                        Favorited Articles
                      </a>
                    </li>
                  </ul>
                </div>

                {articles.map(article => (
                  <ArticlePreview key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
