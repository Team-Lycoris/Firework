import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {Link} from 'react-router-dom';
import '../pages css/login.css';
import { registerRoute, loginRoute } from "../utils/apiRoutes";
import axios from 'axios';

const Authenticate = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Check the validity of the username and password
  function handleValidate() {
    setError('');
    if (!checkUsername(username)) {
      setError('Username must start with a letter and can only consist of alphanumeric characters, ., _, and -.');
      return false;
    }
    if (!checkPassword(password)) {
      setError('Password must only consist of alphanumeric and special characters.');
      return false;
    }
    if (username.length == 0) {
      setError('Please enter a username.');
      return false;
    }
    if (username.length > 30) {
      setError('Your username can be at most 30 characters long.');
      return false;
    }
    if (password.length < 8) {
      setError('Your password must be at least 8 characters long.');
      return false;
    }
    if (password.length > 30) {
      setError('Your password can be at most 30 characters long.');
      return false;
    }
    return true;
  }

  async function handleRegister(event) {
    event.preventDefault();

    // Check the validity of the username and password
    if (!handleValidate()) {
      console.log(error);
      return;
    }

    // Attempt to register in with the API
    const res = await axios.post(registerRoute, {
      username: username,
      password: password
    });

    if (res.data.status) {
      console.log('Successfully registered');
      // Store the JWT in localStorage to be used later.
      // Vulnerable to XSS attack
      localStorage.setItem('user-token', res.data.token);

      // Switch the user to the messages page
      // Replace this with a different page that lets the user
      // set their display name and profile picture later
      navigate('/messages');
    } else {
      // The API returned an error
      setError(res.data.msg);
      console.log(res.data.msg);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();

    // Check the validity of the username and password
    if (!handleValidate()) {
      console.log(error);
      return;
    }

    // Attempt to log in with the API
    const res = await axios.post(loginRoute, {
      username: username,
      password: password
    });

    if (res.data.status) {
      console.log('Successfully logged in');
      // Store the JWT in localStorage to be used later.
      // Vulnerable to XSS attack
      localStorage.setItem('user-token', res.data.token);

      // Switch the user to the messages page
      navigate('/messages');
    } else {
      // The API returned an error
      setError(res.data.msg);
      console.log(res.data.msg);
    }
  }

  return (
    <div className="login-container">
      <form className="login-form">
        <h2>Login</h2>
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            type="text" 
            id="username" 
            name="username" 
            required 
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password" 
            id="password" 
            name="password" 
            required
          />
        </div>
        <button onClick={handleLogin}>Log In</button>
        <buttonText onClick={handleRegister}>Sign Up</buttonText>
        {error &&
          <div className="error">{error}</div>
        }
      </form>
    </div>
  );
};

function checkUsername(username) {
  // Check if the username starts with a character and only consists
  // of alphanumeric characters and some special characters
  let regex = /^[a-zA-Z][a-zA-Z0-9._-]*$/
  return regex.test(username);
}

function checkPassword(password) {
  // Check if the password consists of only letters, numbers, and special characters
  let regex1 = /^[a-zA-Z0-9\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-]*$/
  // Check if the password contains at least one special character
  // let regex2 = /^.*[\][~`!@#$%^&*()_+={}|\\;:"<>,.\/\?-].*$/
  return regex1.test(password);
}

export default Authenticate;
