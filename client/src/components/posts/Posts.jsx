import Post from "../post/Post";
import "./posts.css";

export default function Posts({ posts }) {
  return (
    <div className="posts">
      {posts.map((p, i) => {
        return <Post post={p} key={i} />;
      })}
    </div>
  );
}
