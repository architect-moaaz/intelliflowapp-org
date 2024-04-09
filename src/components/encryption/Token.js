import React, { useState } from 'react';
import PropTypes from 'prop-types';


async function loginUser(credentials) {
 return fetch(process.env.REACT_APP_API_ENDPOINT+'login', {
   method: 'POST',
   headers: {
     'Content-Type': 'application/json'
   },
   body: JSON.stringify(credentials)
 })
   .then(data => data.json())
}

export default function Login({ setToken }) {
  const [username, setUserName] = useState();
  const [password, setPassword] = useState();

  const handleSubmit = async e => {
    e.preventDefault();
    const token = await loginUser({
      username,
      password
    });
    setToken(token);
  }

  return(
    <div className="login-wrapper">
      <h1 className='primaryColor'>Please Log In</h1>
      <form onSubmit={handleSubmit} id="token-loginForm">
        <label className='secondaryColor'>
          <p className='secondaryColor'>Username</p>
          <input type="text" id="token-username-input" onChange={e => setUserName(e.target.value)} />
        </label>
        <label className='secondaryColor'>
          <p className='secondaryColor'>Password</p>
          <input type="password" id="token-password-input" onChange={e => setPassword(e.target.value)} />
        </label>
        <div>
          <button className='primaryButtonColor' type="submit" id="token-submit-button">Submit</button>
        </div>
      </form>
    </div>
  )
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired
};
