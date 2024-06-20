import { useEffect, useState } from "react";
import "./sidebar.css";
import axios from "../../axios";
import { Link } from "react-router-dom";
// import { context } from "../../context/Context";
import { useSelector } from "react-redux";

export default function SideBar() {
  const [categories, setCategories] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [error, setError] = useState("");
  // const { user } = useContext(context);
  useEffect(() => {
    const getCat = async () => {
      try {
        const res = await axios.get("/category");
        // console.log(res);
        setCategories(res.data);
        setError("");
      } catch (err) {
        setError(err.message);
      }
    };
    getCat();
  }, []);
  // console.log(categories);
  return (
    <div className="sidebar">
      {user && (
        <div className="sidebarItem">
          <span className="sidebarTitle">About Me</span>
          <img src={user?.profilePic} alt="" className="sidebarImg" />
          <p className="sidebarAbout">{user?.about}</p>
        </div>
      )}
      <div className="sidebarItem">
        <span className="sidebarTitle">Categories</span>
        <ul className="sidebarList">
          {categories
            ? categories.map((cat, i) => {
                return (
                  <Link to={`/?cat=${cat.name}`} className="link" key={i}>
                    <li className="sidebarListItem" key={i}>
                      {cat.name}
                    </li>
                  </Link>
                );
              })
            : null}
        </ul>
      </div>
      <div className="sidebarItem">
        <span className="sidebarTitle">Follow Us</span>
        <div className="sidebarSocial">
          <i className="sidebarIcon fa-brands fa-square-facebook"></i>
          <i className="sidebarIcon fa-brands fa-square-x-twitter"></i>
          <i className="sidebarIcon fa-brands fa-square-pinterest"></i>
          <i className="sidebarIcon fa-brands fa-square-instagram"></i>
        </div>
      </div>
      {error && <span className="fetchingError">Uh oh! {error}</span>}
    </div>
  );
}
