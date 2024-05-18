import { Link } from "react-router-dom";
import "./post.css";
import DOMPurify from "dompurify";

export default function Post({ post }) {
  const regex = /(<([^>]+)>)/gi;
  return (
    <div className="post">
      <Link to={`/post/${post._id}`} className="link">
        {post.photo && <img src={post.photo} alt="" className="postImg" />}

        <div className="postInfo">
          <div className="postCats">
            {post.categories.map((cat, i) => {
              return (
                <span className="postCat" key={i}>
                  {cat}
                </span>
              );
            })}
          </div>
          <span className="postTitle">{post.title}</span>
          <hr />
          <span className="postDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        <div
          className="postDesc"
          // dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.desc) }}
        >
          {DOMPurify.sanitize(post.desc).replace(regex, " ")}
        </div>
      </Link>
    </div>
  );
}
