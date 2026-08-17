import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Article, setFavorite } from "./api";
import { useAuth } from "./auth";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

type ArticleMetaProps = {
  article: Article;
  onFavoriteToggled: (article: Article) => void;
};

export default function ArticleMeta({ article, onFavoriteToggled }: ArticleMetaProps): JSX.Element {
  const { user } = useAuth();
  const history = useHistory();
  const [isSaving, setIsSaving] = useState(false);

  const handleFavorite = async () => {
    if (!user) {
      history.push("/login");

      return;
    }

    setIsSaving(true);

    try {
      onFavoriteToggled(await setFavorite(article.slug, !article.favorited, user.token));
    } catch (favoriteError) {
      // Nothing on this block can report a failure, so the counter simply stays where it was.
    } finally {
      setIsSaving(false);
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
      <button className="btn btn-sm btn-outline-secondary">
        <i className="ion-plus-round" />
        &nbsp; Follow {article.author.username}
      </button>
      &nbsp;&nbsp;
      <button
        className={`btn btn-sm ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
        onClick={handleFavorite}
        disabled={isSaving}
      >
        <i className="ion-heart" />
        &nbsp; {article.favorited ? "Unfavorite" : "Favorite"} Post{" "}
        <span className="counter">({article.favoritesCount})</span>
      </button>
    </div>
  );
}
