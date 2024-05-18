import { useEffect, useState } from "react";
import "./write.css";
import axios from "../../axios";
// import { context } from "../../context/Context";
import { useNavigate } from "react-router-dom";
import React from "react";
import Select from "react-select";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

export default function Write() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  // const [photo, setPhoto] = useState("");
  const [categories, setCategories] = useState([]);
  const [selCategory, setSelCategory] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  // const { user } = useContext(context);
  const navigate = useNavigate();

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
    const getCategories = async () => {
      const res = await axios.get("/category");
      setCategories(res.data);
    };
    getCategories();
  }, []);

  const handleCategorySelect = async (e) => {
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
      setCategories([...categories, res.data]);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const postCategories = selCategory.map((cat) => cat.label);
    // console.log(postCategories);
    const data = new FormData();
    data.append("title", title);
    data.append("desc", desc);
    data.append("categories", JSON.stringify(postCategories));
    // data.append("photo", photo);
    if (file) {
      data.append("file", file);
    }
    console.log(data);
    try {
      const res = await axios.post("/posts", data);
      navigate(`/post/${res.data._id}`);
      // console.log(res);
    } catch (err) {
      console.log(err);
    }
  };

  const options = categories.map((cat, i) => {
    return { value: cat?._id, label: cat?.name };
  });

  return (
    <div className="write">
      {file && (
        <img src={URL.createObjectURL(file)} alt="" className="writeImg" />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput">
            <i className="writeIcon fa-solid fa-plus"></i>
          </label>
          {
            <input
              type="file"
              id="fileInput"
              accept=".jpeg, .png, .jpg"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          }

          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="writeFormGroup">
          {/* <textarea
            placeholder="Tell your story..."
            type="text"
            className="writeInput writeText"
            onChange={(e) => setDesc(e.target.value)}
          ></textarea> */}
          <ReactQuill
            theme="snow"
            modules={module}
            value={desc}
            className=" writeText"
            onChange={setDesc}
          />
          <button className="writeSubmit" type="submit">
            Publish
          </button>
        </div>
      </form>
      <div className="writeCategory">
        <div className="writeCategoryTitle">Categories: </div>
        <div className="writeCategorySelect">
          <Select
            value={selCategory}
            onChange={handleCategorySelect}
            options={options}
            placeholder="Select the categories from dropdown..."
            isMulti
          />
        </div>
        <div className="writeCategoryCreate">
          <p className="writeCategoryCreateTitle">Create New Category: </p>
          <input
            type="text"
            placeholder="Enter the category name..."
            className="writeCategoryCreateInput"
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="writeCategoryCreateButton"
            onClick={handleCategoryCreate}
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
}
