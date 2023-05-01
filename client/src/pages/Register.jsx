import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState(null);
  //const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const input = { username, email, password };
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/register",
        input
      );
      console.log(res);
      //setError(res);
      
    } catch (err) {
      setError(err.response.data);
    }
  };

  return (
    <div className="auth">
      <h1> Register</h1>
      <form>
        <input
          required
          type="text"
          placeholder="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          required
          type="text"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleSubmit}>Create</button>
        {error && <p>{error}</p>}
        <span>
          Already have an account? <Link to="/login">Login</Link>
        </span>
      </form>
    </div>
  );
};

export default Register;
