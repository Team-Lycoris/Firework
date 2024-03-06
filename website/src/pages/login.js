import React, { useState, useEffect } from "react";
import '../pages css/login.css';
import axios from 'axios';

const registerRoute = 'http://localhost:8080/api/auth/register';
const loginRoute = 'http://localhost:8080/api/auth/login';

const Authenticate = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  function handleValidate() {
    setError('');
    if (!checkUsername(username)) {
      setError('Username must start with a letter and only consist of alphanumeric characters and ., _, -.');
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
    if (!handleValidate()) {
      console.log(error);
      return;
    }
    const res = await axios.post(registerRoute, {
      username: username,
      password: password
    });
    if (res.data.status) {
      console.log('Successfully registered');
    } else {
      setError(res.data.msg);
      console.log(res.data.msg);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    if (!handleValidate()) {
      console.log(res.data.msg);
      return;
    }
    const res = await axios.post(loginRoute, {
      username: username,
      password: password
    });
    console.log(res);
    if (res.data.status) {
      console.log('Successfully logged in');
    } else {
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
            required />
        </div>
        <button onClick={handleLogin}>Log In</button>
        <buttonText onClick={handleRegister}>Sign Up</buttonText>
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
