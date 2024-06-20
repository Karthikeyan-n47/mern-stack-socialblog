import "./contact.css";
import axios from "../../axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Contact() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/users/contact-us", {
        name,
        email,
        message,
      });
      console.log(res);
      setError("");
      navigate("/");
    } catch (err) {
      // console.log(err);
      setError(err.message);
    }
  };

  return (
    <div className="contact">
      <span className="contactTitle">Contact Us</span>
      <form onSubmit={handleSubmit} className="contactForm">
        <label>Name</label>
        <input
          type="text"
          placeholder="Enter your name..."
          required
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email</label>
        <input
          type="email"
          required
          placeholder="Enter your email..."
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Message</label>
        <textarea
          type="text"
          placeholder="Enter your message..."
          required
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <button className="contactButton" type="submit">
          Submit
        </button>
        {error && <span className="contactError">Uh oh! {error}</span>}
      </form>
    </div>
  );
}
