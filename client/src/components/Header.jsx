import React, { useContext } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/blog.png";
import { AuthContext } from "../context/authContext";

const Header = () => {
  const { currentUser, logout } = useContext(AuthContext);

  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link to="/">
            <img src={logo} alt="logo" />
          </Link>
        </div>
        <div className="links">
          <Link className="link" to="/?cat=art">
            ART
          </Link>
          <Link className="link" to="/?cat=science">
            SCIENCE
          </Link>
          <Link className="link" to="/?cat=technology">
            TECHNOLOGY
          </Link>
          <Link className="link" to="/?cat=food">
            FOOD
          </Link>
          <Link className="link" to="/?cat=life">
            LIFE
          </Link>
          <Link className="link" to="/?cat=travel">
            TRAVEL
          </Link>
          <span>{currentUser?.username}</span>
          {currentUser ? (
            <button onClick={logout}>Logout</button>
          ) : (
            <Link to="/login">
              login
            </Link>
          )}
          <span className="write">
            <Link className="link" to="/write">
              Post
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Header;
