import { Link } from "react-router-dom";

import { Article } from "./api";
import AuthorImage from "./AuthorImage";
import { formatDate } from "./date";

type ArticleMetaProps = {
  article: Article;
};

export default function ArticleMeta({ article }: ArticleMetaProps): JSX.Element {
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
      <button className="btn btn-sm btn-outline-primary">
        <i className="ion-heart" />
        &nbsp; Favorite Post <span className="counter">({article.favoritesCount})</span>
      </button>
    </div>
  );
}
