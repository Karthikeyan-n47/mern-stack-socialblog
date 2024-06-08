import { useState } from "react";
import "./topbar.css";
import { Link } from "react-router-dom";
// import { context } from "../../context/Context";
import axios from "../../axios";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import {
  logoutFailure,
  logoutStart,
  logoutSuccess,
} from "../../redux/user/userSlice";

export default function TopBar() {
  // const { user, dispatch } = useContext(context);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");

  const handleLogout = async () => {
    dispatch(logoutStart());
    try {
      await axios.post("/auth/logout");
      // dispatch({ type: "LOGOUT" });
      dispatch(logoutSuccess());
    } catch (err) {
      // console.log(err.message);
      dispatch(logoutFailure(err.message));
    }
  };

  return (
    <>
      <div className="top">
        <div className="topLeft">
          <Link to={"/"} className="link">
            <span className="topLogo">SocialBlog</span>
          </Link>
        </div>
        <div className="topCenter">
          <ul className="topList">
            <li className="topListItem">
              <Link to={"/"} className="link">
                Home
              </Link>
            </li>

            <li className="topListItem">
              <Link to={"/about"} className="link">
                About
              </Link>
            </li>

            <li className="topListItem">
              <Link to={"/contact"} className="link">
                Contact
              </Link>
            </li>

            <li className="topListItem">
              <Link to={"/write"} className="link">
                Write
              </Link>
            </li>

            {/* <li className="topListItem" onClick={handleLogout}>
              {user && "Logout"}
            </li> */}
          </ul>
        </div>
        <div className="topSearchContainer">
          <Link to={`/?search=${search}`} className="link">
            <i className="searchIcon fa-solid fa-magnifying-glass"></i>
          </Link>
          <input
            type="text"
            className="topSearchInput"
            placeholder="Enter post name..."
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="topRight">
          {user ? (
            <>
              <Link className="link" to={"/settings"}>
                <img
                  className="topImg"
                  src={
                    user.profilePic === ""
                      ? "https://socialmedia-mern-stack-s3-upload.s3.ap-south-1.amazonaws.com/uploads/1713266275730-noAvatar.png"
                      : user.profilePic
                  }
                  alt=""
                />
              </Link>
              <span className=" topListLogout" onClick={handleLogout}>
                <i class="fa-solid fa-power-off"></i>
              </span>
            </>
          ) : (
            <ul className="topList">
              <li className="topListItem">
                <Link to={"/login"} className="link">
                  Login
                </Link>
              </li>
              <li className="topListItem">
                <Link to={"/register"} className="link">
                  Register
                </Link>
              </li>
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
