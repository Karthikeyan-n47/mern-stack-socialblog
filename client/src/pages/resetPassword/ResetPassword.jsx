import { useState } from "react";
import "./resetPassword.css";
import axios from "../../axios";
import { useNavigate, useParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const { id, token } = useParams();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setError("Passwords entered do not match!");
    }
    try {
      await axios.post(`/auth/reset-password/${id}/${token}`, {
        password,
        confirmPassword,
      });
      setError("");
      navigate("/login");
    } catch (err) {
      // console.log(err.message);
      setError(err.message);
    }
  };
  return (
    <div className="resetPassword">
      <span className="resetPasswordTitle">Reset Password</span>
      <form className="resetPasswordForm" onSubmit={handleSubmit}>
        <label>Password</label>
        <input
          type="password"
          placeholder="Enter your new password..."
          onChange={(e) => setPassword(e.target.value)}
        />
        <label>Confirm Password</label>
        <input
          type="password"
          placeholder="Confirm your new password..."
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <button className="resetPasswordButton" type="submit">
          Reset Password
        </button>
        {error && <span className="fetchingError">Uh oh! {error}</span>}
      </form>
    </div>
  );
}
