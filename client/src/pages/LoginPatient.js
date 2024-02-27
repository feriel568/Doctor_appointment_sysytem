import React , {useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import '../Styles/loginPatient.css'

const LoginPatient = () => {

  const [username , setUsername]=useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handelLogin = async () =>{
    try{
      if(!username || !password) {
        setError('username and password are required.')
      }
      const response = await axios.post('http://localhost:5000/patient/login', {
        username,
        password,
      });

      
      const { token, patient } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(patient));
      localStorage.setItem('token', token);
      navigate('/dash_patient');
    }catch (error) {
      console.error(error);
      setError('Invalid email or password.');
  }
}
  return (
    <div className="loginContainerPt">
    <div className="loginFormPt">
      <h2>Login</h2>
      <div className="inputContainerPt">
        <input
          value={username}
          placeholder="Enter your username here"
          onChange={(ev) => setUsername(ev.target.value)}
          className="inputBox"
        />
      </div>
      <div className="inputContainerPt">
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
      <div className="inputContainerPt">
        <p className="error-message">{error}</p>
        <input
          className="inputButtonPt"
          type="button"
          onClick={handelLogin}
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
