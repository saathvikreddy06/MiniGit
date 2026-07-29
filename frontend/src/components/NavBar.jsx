import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav>

      <Link to="/" className="logo-link">
        <div className="logo-container">
          <img
            src="https://www.github.com/images/modules/logos_page/GitHub-Mark.png"
            alt="GitHub Logo"
          />
          <h3>MiniGit</h3>
        </div>
      </Link>

      <div className="nav-links">

        <Link to="/create">
          <p>Create Repository</p>
        </Link>

        <Link to="/profile">
          <p>Profile</p>
        </Link>

      </div>

    </nav>
  );
};

export default NavBar;