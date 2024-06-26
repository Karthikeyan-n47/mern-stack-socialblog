import { useEffect, useState } from "react";
import Post from "../post/Post";
import "./posts.css";
import axios from "../../axios";
import { Link } from "react-router-dom";

export default function Posts({ posts }) {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const getCategory = async () => {
      try {
        const res = await axios.get("/category");
        setCategories(res?.data);
        setError("");
      } catch (err) {
        // console.log(err);
        setError(err.message);
      }
    };
    getCategory();
  }, []);
  return (
    <div className="postsWrapper">
      <div className="categoriesTitle">Categories:</div>
      <div className="categoriesContainer">
        {categories?.map((category, i) => {
          return (
            <Link to={`/?cat=${category?.name}`} className="link" key={i}>
              <div className="categoriesWrapper">{category?.name}</div>
            </Link>
          );
        })}
      </div>
      {error && <span className="fetchingError">Uh oh! {error}</span>}
      <div className="posts">
        {posts.map((p, i) => {
          return <Post post={p} key={i} />;
        })}
      </div>
    </div>
  );
}
