import React, { useEffect, useState } from "react";
import "./App.css";
import LoginSignup from "./Components/Assets/LoginSignup";
import Home from "./Home";
import { getCurrentUser, clearCurrentUser } from "./auth";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const saved = getCurrentUser();
    if (saved) {
      setCurrentUser(saved);
    }
  }, []);

  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    clearCurrentUser();
    setCurrentUser(null);
  };

  return (
    <div className="App-root">
      {currentUser ? (
        <Home currentUser={currentUser} onLogout={handleLogout} />
      ) : (
        <LoginSignup onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
