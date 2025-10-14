import React from 'react'
import "./Header.css"
import { Link } from 'react-router-dom';

 const Header = () => {
  return (
    <>
    <div className="blog-wrapper">
      {/* Header */}
      <header className="header">
        <div className="container">
          <div className="header-inner">
            <div className="logo">
              <svg
                height="24"
                width="24"
                fill="currentColor"
                viewBox="0 0 48 48"
              >
                <path d="M6 6H42L36 24L42 42H6L12 24L6 6Z" />
              </svg>
              <span>BlogBook</span>
            </div>

            <nav className="nav">
              <Link to = "/dashboard">Home</Link> 
              <Link to="/category">Categories</Link>
              <Link to= "/write">Write</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </nav>

            <div className="search-bar">
              <input type="text" placeholder="Search" />
              <svg
                height="20"
                width="20"
                fill="currentColor"
                viewBox="0 0 256 256"
              >
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
              </svg>
            </div>
          </div>
        </div>
      </header>
      </div>
    </>
  )
}
export default Header;