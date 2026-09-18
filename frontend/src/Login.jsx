import { useState } from "react";

function Login({ onLogin }) {
  const [isSignup, setIsSignup] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isSignup
      ? "https://ricoztrack.onrender.com/api/users/signup"
      : "https://ricoztrack.onrender.com/api/users/login";

    const body = isSignup
      ? { name, email, password }
      : { email, password };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const text = await response.text();

      console.log("SERVER RESPONSE:", text);

      let data = {};

      try {
        data = JSON.parse(text);
      } catch (error) {
        data = {
          message: text || "Server returned an empty response",
        };
      }

      if (!response.ok) {
        alert(
          data.error
            ? `${data.message}: ${data.error}`
            : data.message || "Something went wrong"
        );
        return;
      }

      if (isSignup) {
        alert("Signup successful! Please login.");

        setIsSignup(false);
        setName("");
        setEmail("");
        setPassword("");
      } else {
        localStorage.setItem("ricoztrack_token", data.token);

        localStorage.setItem(
          "ricoztrack_user",
          JSON.stringify(data.user)
        );

        onLogin(data.user);
      }
    } catch (error) {
      console.error("LOGIN ERROR:", error);

      alert("Unable to connect to server. Please try again.");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>RicozTrack</h1>

        <p className="login-subtitle">
          Project Management System
        </p>

        <h2>
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>

        <form onSubmit={handleSubmit}>
          {isSignup && (
            <>
              <label>Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </>
          )}

          <label>Email</label>

          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>

          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            className="login-button"
          >
            {isSignup ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="switch-text">
          {isSignup
            ? "Already have an account?"
            : "Don't have an account?"}

          <button
            type="button"
            className="switch-button"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? " Login" : " Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default Login;