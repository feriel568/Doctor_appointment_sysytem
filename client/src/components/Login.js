import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import "../Styles/loginAdmin.css"

const Login = () => {
  // const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      // Check if email or password is empty
      if (!username || !password) {
        setError('username and password are required.');
        return;
      }

      const response = await axios.post('http://localhost:5000/admin/signin', {
        username,
        password,
      });

      // Assuming your backend returns a token upon successful login
      const { token, user } = response.data;

      // Store token and user information in local storage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Handle successful login (e.g., store token in localStorage)
      localStorage.setItem('token', token);

      // Redirect to the admin dashboard
      navigate('/dash_admin');
    } catch (error) {
        // Handle login failure
        console.error(error);

        // Display an error message to the user
        setError('Invalid email or password.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <div className="inputContainer">
          <input
            value={username}
            placeholder="Enter your username here"
            onChange={(ev) => setUsername(ev.target.value)}
            className="inputBox"
          />
        </div>
        <div className="inputContainer">
          <input
            type="password"
            value={password}
            placeholder="Enter your password here"
            onChange={(ev) => setPassword(ev.target.value)}
            className="inputBox"
          />
          <div className='fPass'>
            <p>Forget password</p>          
           </div>
        </div>
        <div className="inputContainer">
          <p className="error-message">{error}</p>
          <input
            className="inputButton"
            type="button"
            onClick={handleLogin}
            value="Login"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;




// address: "",
//         phone: "",
//         fee: "",
//         specialization: "",
//         startTime: "",
//         endTime: "",