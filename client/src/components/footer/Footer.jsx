import "./footer.css";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <div className="footer">
      <div className="footerTop">
        <div className="footerLeft">
          <div className="footerLeftTop">Links</div>
          <div className="footerLeftBottom">
            <div className="footerLeftBottomContainer">
              <Link to={"/contact"} className="link">
                Contact
              </Link>
              <Link to={"/about"} className="link">
                About
              </Link>
              <Link to={"/write"} className="link">
                Write
              </Link>
            </div>
            <div className="footerLeftBottomContainer">
              <Link to={"/terms"} className="link">
                Terms Of Service
              </Link>
              <Link to={"/privacy"} className="link">
                Privacy Policy
              </Link>
              <Link to={"/settings"} className="link">
                Account
              </Link>
            </div>
          </div>
        </div>
        <div className="footerRight">
          <div className="footerRightTitle">SocialBlog</div>
          <p className="footerRightDesc">
            Social Blog is a generic blog that covers a wide range of topics,
            catering to diverse interests and providing valuable information to
            readers. Our aim is to create a platform where people can engage,
            learn, and share their thoughts on various subjects.
          </p>
          <div className="footerRightLinks">
            <i className="footerIcons fa-brands fa-square-facebook"></i>
            <i className="footerIcons fa-brands fa-square-instagram"></i>
            <i className="footerIcons fa-brands fa-square-x-twitter"></i>
            <i className="footerIcons fa-brands fa-square-reddit"></i>
            <i className="footerIcons fa-brands fa-square-pinterest"></i>
          </div>
        </div>
      </div>
      <div className="footerBottom">2023 © SocialBlog All Rights Reserved</div>
    </div>
  );
}
