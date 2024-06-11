import { Link, useLocation } from "react-router-dom";
import "./singlepost.css";
import { useEffect, useState } from "react";
import axios from "../../axios";
import Select from "react-select";
// import { context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import Comments from "../comments/Comments";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
// import ReactHtmlParser from 'react-html-parser';

export default function SinglePost() {
  // const { user } = useContext(context);
  const { user } = useSelector((state) => state.user);
  const location = useLocation().pathname.split("/")[2];
  const [post, setPost] = useState({});
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selCategory, setSelCategory] = useState([]);
  const [newCategory, setNewCategory] = useState("");

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
      const cat = await axios.get("/category");
      setPost(res.data);
      setTitle(res.data.title);
      setDesc(res.data.desc);
      setCategories(cat.data);
      if (res?.data?.categories) {
        setSelCategory(
          res?.data?.categories?.map((ca) => {
            return { value: ca, label: ca };
          })
        );
      }
    };
    fetchPost();
  }, [location]);

  const handleCategorySelect = (e) => {
    setSelCategory(e);
  };

  const handleCategoryCreate = async () => {
    if (!newCategory) {
      return;
    }
    try {
      const res = await axios.post("/category", {
        name: newCategory,
      });
      // console.log(res.data);
      setCategories([...categories, res?.data]);
    } catch (err) {
      console.log(err);
    }
  };

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
    const postCategories = selCategory.map((cat) => cat.label);
    try {
      const res = await axios.put(`/posts/${post._id}`, {
        title,
        desc,
        categories: JSON.stringify(postCategories),
      });
      // console.log(res);
      setUpdateMode(false);

      setPost(res?.data);
      setTitle(res?.data?.title);
      setDesc(res?.data?.desc);
      if (res?.data?.categories) {
        setSelCategory(
          res?.data?.categories?.map((ca) => {
            return { value: ca, label: ca };
          })
        );
      }
      // window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const options = categories?.map((cat) => {
    return { value: cat.name, label: cat.name };
  });
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
          <ReactQuill
            modules={module}
            value={desc}
            onChange={setDesc}
            theme="snow"
            className="singlePostDescInput"
          />
        ) : (
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

      {updateMode ? (
        <div className="singlePostCategoriesContainer">
          <div className="singlePostCategoriesTitle">Category:</div>
          <div className="singlePostCategoriesSelect">
            <Select
              value={selCategory}
              options={options}
              onChange={handleCategorySelect}
              isMulti
              placeholder="Select the categories from dropdown..."
            />
          </div>
        </div>
      ) : (
        post?.categories && (
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
        )
      )}
      {updateMode && (
        <div className="singlePostCategoryCreate">
          <p className="singlePostCategoryCreateTitle">Create New Category: </p>
          <input
            type="text"
            placeholder="Enter the category name..."
            className="singlePostCategoryCreateInput"
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="singlePostCategoryCreateButton"
            onClick={handleCategoryCreate}
          >
            Create
          </button>
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
