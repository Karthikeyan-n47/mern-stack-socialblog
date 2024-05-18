import "./settings.css";
import SideBar from "../../components/sidebar/SideBar";
import { useContext, useState } from "react";
import { context } from "../../context/Context";
import axios from "../../axios";

export default function Settings() {
  const { user, dispatch } = useContext(context);
  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [about, setAbout] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("username", username);
    data.append("email", email);
    data.append("about", about);
    if (password) {
      data.append("password", password);
    }
    // data.append("userId", user._id);
    data.append("profilePic", user.profilePic);
    if (file) {
      data.append("file", file);
    }
    dispatch({ type: "UPDATE_START" });
    try {
      // console.log(data);
      const res = await axios.put(`/users/${user._id}`, data);
      console.log(res);
      dispatch({ type: "UPDATE_SUCCESS", payload: res.data });
    } catch (err) {
      console.log(err);
      dispatch({ type: "UPDATE_FAILURE" });
    }
  };
  const handleDelete = async () => {
    try {
      const res = await axios.delete(`/users/${user?._id}`);
      console.log(res.data);
      dispatch({ type: "LOGOUT" });
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="settings">
      <div className="settingsWrapper">
        <div className="settingsTitle">
          <span className="settingsUpdateTitle">Update Your Account</span>
          <span className="settingsDeleteTitle" onClick={handleDelete}>
            Delete Your Account
          </span>
        </div>
        <form className="settingsForm" onSubmit={handleSubmit}>
          <label>Profile Picture</label>
          <div className="settingsPP">
            <img
              className="settingsPPImg"
              src={
                (file ? URL.createObjectURL(file) : user?.profilePic) ||
                "https://socialmedia-mern-stack-s3-upload.s3.ap-south-1.amazonaws.com/uploads/1713266275730-noAvatar.png"
              }
              alt=""
            />
            <label htmlFor="fileInput">
              <i className="settingsPPIcon fa-regular fa-circle-user"></i>
            </label>
            <input
              type="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
          </div>
          <label>Username</label>
          <input
            type="text"
            placeholder={user.username}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <label>Email</label>
          <input
            type="email"
            placeholder={user.email}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <label>Password</label>
          <input
            type="password"
            placeholder="**************"
            onChange={(e) => setPassword(e.target.value)}
          />
          <label>About Me</label>
          <textarea
            type="text"
            placeholder={user.about}
            onChange={(e) => setAbout(e.target.value)}
          />
          <button className="settingsSubmit" type="submit">
            Update
          </button>
        </form>
      </div>
      <SideBar />
    </div>
  );
}
