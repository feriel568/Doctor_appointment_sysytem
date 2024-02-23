import React from "react";
import { Link } from "react-router-dom";
import '../Styles/loginPatient.css'

const LoginPatient = () => {
  return (
    <div className="loginContainerPt">
    <div className="loginFormPt">
      <h2>Login</h2>
      <div className="inputContainerPt">
        <input
          // value={username}
          placeholder="Enter your username here"
          // onChange={(ev) => setUsername(ev.target.value)}
          className="inputBox"
        />
      </div>
      <div className="inputContainerPt">
        <input
          type="password"
          // value={password}
          placeholder="Enter your password here"
          // onChange={(ev) => setPassword(ev.target.value)}
          className="inputBox"
        />
        <div className='fPass'>
          <p>Forget password</p>          
         </div>
      </div>
      <div className="inputContainerPt">
        {/* <p className="error-message">{error}</p> */}
        <input
          className="inputButtonPt"
          type="button"
          // onClick={handleLogin}
          value="Login"
        />
      </div>
      <Link to="/register">
      <p className="crAcc">Don't you have an account?SignUp</p>
      </Link>
    </div>
  </div>
  );
};

export default LoginPatient;
