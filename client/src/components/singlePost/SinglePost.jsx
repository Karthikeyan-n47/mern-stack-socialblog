import { Link, useLocation } from "react-router-dom";
import "./singlepost.css";
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
// import ReactHtmlParser from 'react-html-parser';

export default function SinglePost() {
  const { user } = useContext(context);
  const location = useLocation().pathname.split("/")[2];
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  const toolbarOptions = [
    ["bold", "italic", "underline", "strike"], // toggled buttons
    ["blockquote", "code-block"],
    ["link", "image", "video", "formula"],

    [{ header: 1 }, { header: 2 }], // custom button values
    [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
    [{ script: "sub" }, { script: "super" }], // superscript/subscript
    [{ indent: "-1" }, { indent: "+1" }], // outdent/indent
    [{ direction: "rtl" }], // text direction

    [{ size: ["small", false, "large", "huge"] }], // custom dropdown
    [{ header: [1, 2, 3, 4, 5, 6, false] }],

    [{ color: [] }, { background: [] }], // dropdown with defaults from theme
    [{ font: [] }],
    [{ align: [] }],

    ["clean"],
  ];

  const module = {
    toolbar: toolbarOptions,
  };

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${location}`);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    fetchPost();
  }, [location]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/posts/${post._id}`);
      console.log(res);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/posts/${post._id}`, {
        title,
        desc,
      });
      console.log(res);
      setUpdateMode(false);
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };

  /*const handleCommentDelete = async (comment) => {
    try {
      const res = await axios.delete(`/comments/${comment._id}`);
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleCommentUpdate = async (comment, e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`/comments/${comment._id}`, {
        message,
      });
      console.log(res);
      setUpdateCommentMode(false);
    } catch (err) {
      console.log(err.message);
    }
  };
  const handleCommentCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`/comments/${post._id}`, {
        message: newComment,
      });
      console.log(res);
    } catch (err) {
      console.log(err.message);
    }
  };*/
  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.user?.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon fa-regular fa-pen-to-square"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.user?._id}`} className="link">
              <b>{post.user?.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          // <input
          //   type="text"
          //   className="singlePostDescInput"
          //   value={desc}
          //   onChange={(e) => setDesc(e.target.value)}
          // ></input>
          <ReactQuill
            modules={module}
            value={desc}
            onChange={setDesc}
            theme="snow"
            className="singlePostDescInput"
          />
        ) : (
          // <p className="singlePostDesc">{desc}</p>
          <div
            className="singlePostDesc"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(desc) }}
          ></div>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>

      {post?.categories && (
        <div className="singlePostCategoriesContainer">
          <div className="singlePostCategoriesTitle">Category:</div>
          <div className="singlePostCategoriesContentWrapper">
            {post?.categories?.map((cat, i) => {
              return (
                <Link
                  to={`/?cat=${cat}`}
                  className="link singlePostCategoriesContent"
                  key={i}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      <Comments />
    </div>
  );
}

/*

import { Link, useLocation } from "react-router-dom";
import "./singlepost.css";
import { useContext, useEffect, useState } from "react";
import axios from "../../axios";
import { context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
// import Comments from "../comments/Comments";

export default function SinglePost() {
  const { user } = useContext(context);
  const location = useLocation().pathname.split("/")[2];
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const res = await axios.get(`/posts/${location}`);
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
    };
    fetchPost();
  }, [location]);

  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/posts/${post._id}`);
      console.log(res);
      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    try {
      const res = await axios.put(`/posts/${post._id}`, {
        title,
        desc,
      });
      console.log(res);
      setUpdateMode(false);
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="singlePost">
      <div className="singlePostWrapper">
        {post.photo && (
          <img src={post.photo} alt="" className="singlePostImg" />
        )}
        {updateMode ? (
          <input
            type="text"
            value={title}
            className="singlePostTitleInput"
            autoFocus
            onChange={(e) => setTitle(e.target.value)}
          ></input>
        ) : (
          <h1 className="singlePostTitle">
            {title}
            {post.user?.username === user?.username && (
              <div className="singlePostEdit">
                <i
                  className="singlePostIcon fa-regular fa-pen-to-square"
                  onClick={() => setUpdateMode(true)}
                ></i>
                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={handleDelete}
                ></i>
              </div>
            )}
          </h1>
        )}
        <div className="singlePostInfo">
          <span className="singlePostAuthor">
            Author:
            <Link to={`/?user=${post.user?._id}`} className="link">
              <b>{post.user?.username}</b>
            </Link>
          </span>
          <span className="singlePostDate">
            {new Date(post.createdAt).toDateString()}
          </span>
        </div>
        {updateMode ? (
          <input
            type="text"
            className="singlePostDescInput"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          ></input>
        ) : (
          <p className="singlePostDesc">{desc}</p>
        )}
        {updateMode && (
          <button className="singlePostButton" onClick={handleUpdate}>
            Update
          </button>
        )}
      </div>
      {<Comments /> }
      </div>
    );
  }
  

*/
