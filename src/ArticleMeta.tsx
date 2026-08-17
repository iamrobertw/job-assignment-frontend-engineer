import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Article, Profile, setFavorite, setFollow } from "./api";
import { useAuth } from "./auth";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

type ArticleMetaProps = {
  article: Article;
  onFavoriteToggled: (article: Article) => void;
  onFollowToggled: (author: Profile) => void;
};

export default function ArticleMeta({ article, onFavoriteToggled, onFollowToggled }: ArticleMetaProps): JSX.Element {
  const { user } = useAuth();
  const history = useHistory();
  const [isSavingFavorite, setIsSavingFavorite] = useState(false);
  const [isSavingFollow, setIsSavingFollow] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      history.push("/login");

      return;
    }

    setIsSavingFavorite(true);

    try {
      onFavoriteToggled(await setFavorite(article.slug, !article.favorited, user.token));
    } catch (favoriteError) {
      // Nothing on this block can report a failure, so the counter simply stays where it was.
    } finally {
      setIsSavingFavorite(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      history.push("/login");

      return;
    }

    setIsSavingFollow(true);

    try {
      onFollowToggled(await setFollow(article.author.username, !article.author.following, user.token));
    } catch (followError) {
      // Nothing on this block can report a failure, so the button simply stays as it was.
    } finally {
      setIsSavingFollow(false);
    }
  };

  return (
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
      <button
        className={`btn btn-sm ${article.author.following ? "btn-secondary" : "btn-outline-secondary"}`}
        onClick={handleFollow}
        disabled={isSavingFollow}
      >
        <i className="ion-plus-round" />
        &nbsp; {article.author.following ? "Unfollow" : "Follow"} {article.author.username}
      </button>
      &nbsp;&nbsp;
      <button
        className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
        onClick={handleFavorite}
        disabled={isSavingFavorite}
      >
        <i className="ion-heart" />
        &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Post{" "}
        <span className="counter">({article.favoritesCount})</span>
      </button>
    </div>
  );
}
