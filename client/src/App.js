import Home from "./pages/home/Home";
import TopBar from "./components/topbar/TopBar";
import Register from "./pages/register/Register";
import Login from "./pages/login/Login";
import Settings from "./pages/settings/Settings";
import Write from "./pages/write/Write";
import Single from "./pages/single/Single";
import { Route, Routes, Navigate } from "react-router-dom";
import { useContext } from "react";
import { context } from "./context/Context";
import ForgotPassword from "./pages/forgotPassword/ForgotPassword";
import ResetPassword from "./pages/resetPassword/ResetPassword";
import Contact from "./pages/contact/Contact";
import Footer from "./components/footer/Footer";
import About from "./pages/aboutUs/About";
import PrivacyPolicy from "./pages/privacyPolicy/PrivacyPolicy";
import Terms from "./pages/termsOfService/Terms";

export default function App() {
  const { user } = useContext(context);
  return (
    <>
      <TopBar />
      <Routes>
        <Route
          exact
          path="/"
          element={user ? <Home /> : <Navigate replace to={"/login"} />}
        />
        <Route
          path="/register"
          element={user ? <Navigate replace to={"/"} /> : <Register />}
        />
        <Route
          path="/login"
          element={user ? <Navigate replace to={"/"} /> : <Login />}
        />
        <Route
          path="/forgot-password"
          element={user ? <Navigate replace to={"/"} /> : <ForgotPassword />}
        />
        <Route
          path="/reset-password/:id/:token"
          element={user ? <Navigate replace to={"/"} /> : <ResetPassword />}
        />
        <Route
          path="/settings"
          element={user ? <Settings /> : <Navigate replace to={"/login"} />}
        />
        <Route
          path="/write"
          element={user ? <Write /> : <Navigate replace to={"/login"} />}
        />
        <Route path="/about" element={<About />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/post/:postId" element={<Single />} />
      </Routes>
      <Footer />
    </>
  );
}
