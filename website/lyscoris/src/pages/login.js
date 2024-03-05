import React from "react";
import '../pages css/login.css';

const Authenticate = () => {
  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button>Log In</button>
        <buttonText>Sign Up</buttonText>
      </form>
    </div>
  );
};

export default Authenticate;
