import avatarPlaceholder from "./avatar-placeholder.svg";

type AuthorImageProps = {
  image: string;
  username: string;
  className?: string;
};

// The API returns an empty string for authors without a picture.
export default function AuthorImage({ image, username, className }: AuthorImageProps): JSX.Element {
  return <img src={image || avatarPlaceholder} alt={username} className={className} />;
}
