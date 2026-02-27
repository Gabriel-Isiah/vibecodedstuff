import React, { useState, useEffect } from "react";
import "./LoginSignup/LoginSignup.css";
import emailIcon from "./email.png";
import passwordIcon from "./padlock.png";
import userIcon from "./user.png";
import {
  ensureSeedUsers,
  getUsers,
  saveUsers,
  setCurrentUser,
} from "../../auth";

const LoginSignup = ({ onLoginSuccess }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [registerForm, setRegisterForm] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterForm((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    ensureSeedUsers();
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();
    const found = users.find(
      (u) =>
        u.email.toLowerCase() === loginForm.email.toLowerCase() &&
        u.password === loginForm.password
    );

    if (!found) {
      alert("Invalid email or password.");
      return;
    }

    setCurrentUser(found);
    if (onLoginSuccess) {
      onLoginSuccess(found);
    }
  };

  const handleRegisterSubmit = (e) => {
    e.preventDefault();
    const users = getUsers();

    const existing = users.find(
      (u) => u.email.toLowerCase() === registerForm.email.toLowerCase()
    );

    if (existing) {
      alert("An account with this email already exists.");
      return;
    }

    const newUser = {
      email: registerForm.email,
      password: registerForm.password,
      role: registerForm.role,
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    alert("Registration successful! You can now log in.");
    setMode("login");
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-toggle">
          <button
            className={mode === "login" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setMode("login")}
          >
            Login
          </button>
          <button
            className={mode === "register" ? "toggle-btn active" : "toggle-btn"}
            onClick={() => setMode("register")}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <form className="auth-form" onSubmit={handleLoginSubmit}>
            <h2 className="auth-title">Welcome Back</h2>

            <div className="auth-field">
              <img src={emailIcon} alt="Email" className="field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>

            <div className="auth-field">
              <img src={passwordIcon} alt="Password" className="field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>

            <button type="submit" className="auth-submit">
              Login
            </button>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegisterSubmit}>
            <h2 className="auth-title">Create Account</h2>

            <div className="auth-field">
              <img src={emailIcon} alt="Email" className="field-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={registerForm.email}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className="auth-field">
              <img src={passwordIcon} alt="Password" className="field-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={registerForm.password}
                onChange={handleRegisterChange}
                required
              />
            </div>

            <div className="auth-field">
              <img src={userIcon} alt="Role" className="field-icon" />
              <select
                name="role"
                value={registerForm.role}
                onChange={handleRegisterChange}
                required
              >
                <option value="user">User</option>
                <option value="researcher">Researcher</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <button type="submit" className="auth-submit">
              Register
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;