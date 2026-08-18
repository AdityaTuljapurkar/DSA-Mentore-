import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterUser() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [conformPassword, setConformPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/register",
        { username, password }
      );

      setMessage(response.data.message);
      navigate("/login");
    } catch (err) {
      const responseData = err.response?.data;
      setError(responseData?.error || "Could not connect to the server.");
    }
  }

  return (
    <main>
      <h1>Create your account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          {conformPassword && conformPassword !== password && <span color="red">the password doen't match</span> }
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            id="conformpassword"
            type="password"
            value={conformPassword}
            onChange={(event) => setConformPassword(event.target.value)}
            required
          />
        </div>

        {error && <p role="alert">{error}</p>}
        {message && <p>{message}</p>}

        <button type="submit">Register</button>
      </form>

      <p>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </main>
  );
}
