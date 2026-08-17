import { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";

import { Article, getArticles, getProfile, Profile as ProfileModel, setFollow } from "./api";
import ArticlePreview from "./ArticlePreview";
import { useAuth } from "./auth";
import AuthorImage from "./AuthorImage";
import Layout from "./Layout";

export default function Profile(): JSX.Element {
  const { username } = useParams<{ username: string }>();
  const { user } = useAuth();
  const history = useHistory();
  const [profile, setProfile] = useState<ProfileModel | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const loadPage = async () => {
      try {
        // The page needs both resources anyway, so they travel in parallel rather than one after another.
        const [loadedProfile, loadedArticles] = await Promise.all([
          getProfile(username, user?.token, controller.signal),
          getArticles({ author: username }, user?.token, controller.signal),
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
  }, [username, user]);

  // Takes the profile as an argument because the button only renders once it has been loaded.
  const handleFollow = async (current: ProfileModel) => {
    if (!user) {
      history.push("/login");

      return;
    }

    setIsSaving(true);

    try {
      setProfile(await setFollow(current.username, !current.following, user.token));
    } catch (followError) {
      // Nothing on this page can report a failure, so the button simply stays as it was.
    } finally {
      setIsSaving(false);
    }
  };

  const handleFavoriteToggled = (updated: Article) =>
    setArticles(current => current.map(article => (article.slug === updated.slug ? updated : article)));

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
                  <button
                    className={`btn btn-sm ${profile.following ? "btn-secondary" : "btn-outline-secondary"} action-btn`}
                    onClick={() => handleFollow(profile)}
                    disabled={isSaving}
                  >
                    <i className="ion-plus-round" />
                    &nbsp; {profile.following ? "Unfollow" : "Follow"} {profile.username}
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
                  <ArticlePreview key={article.slug} article={article} onFavoriteToggled={handleFavoriteToggled} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
