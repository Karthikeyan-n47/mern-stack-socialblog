import { useState } from "react";
import "./forgotPassword.css";
import axios from "../../axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgot-password", {
        email,
      });
    } catch (err) {
      console.log(err.message);
    }
  };
  return (
    <div className="forgotPassword">
      <span className="forgotPasswordTitle">Forgot Password?</span>
      <form className="forgotPasswordForm" onSubmit={handleSubmit}>
        <label>Email</label>
        <input
          type="email"
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <button className="forgotPasswordButton" type="submit">
          Submit
        </button>
      </form>
    </div>
  );
}
