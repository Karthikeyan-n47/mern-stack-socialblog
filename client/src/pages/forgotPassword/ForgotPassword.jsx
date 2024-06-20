import { useState } from "react";
import "./forgotPassword.css";
import axios from "../../axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [emailSentSuccess, setEmailSentSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/auth/forgot-password", {
        email,
      });
      setError("");
      setEmailSentSuccess(true);
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
      setEmailSentSuccess(false);
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
        {emailSentSuccess && (
          <span className="emailSuccess">
            Your email address has been successfully sent..
          </span>
        )}
        {error && <span className="emailFailure">Uh oh! {error}</span>}
      </form>
    </div>
  );
}
