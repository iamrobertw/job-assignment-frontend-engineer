import { useState } from "react";
import { Link, useHistory } from "react-router-dom";

import { Article, setFavorite } from "./api";
import { useAuth } from "./auth";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

type ArticlePreviewProps = {
  article: Article;
  onFavoriteToggled: (article: Article) => void;
};

export default function ArticlePreview({ article, onFavoriteToggled }: ArticlePreviewProps): JSX.Element {
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
      // A card has nowhere to report this, so a failed toggle just leaves the heart as it was.
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="article-preview">
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
          className={`btn btn-sm pull-xs-right ${article.favorited ? "btn-primary" : "btn-outline-primary"}`}
          onClick={handleFavorite}
          disabled={isSaving}
        >
          <i className="ion-heart" /> {article.favoritesCount}
        </button>
      </div>
      <Link to={`/${article.slug}`} className="preview-link">
        <h1>{article.title}</h1>
        <p>{article.description}</p>
        <span>Read more...</span>
      </Link>
    </div>
  );
}
