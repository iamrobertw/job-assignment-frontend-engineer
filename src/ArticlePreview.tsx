import { Link } from "react-router-dom";

import { Article } from "./api";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

type ArticlePreviewProps = {
  article: Article;
};

export default function ArticlePreview({ article }: ArticlePreviewProps): JSX.Element {
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
        <button className="btn btn-outline-primary btn-sm pull-xs-right">
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
