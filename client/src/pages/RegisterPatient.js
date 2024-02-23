import React , {useState} from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../Styles/registerPatient.css";

const RegisterPatient = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        username: "",
        email: "",
        password: "",
        gender: "",
        address: "",
        phone: "",
      });

      const [successMessage, setSuccessMessage] = useState(null);
      const [errorMessage, setErrorMessage] = useState(null);
      const [isPopupVisible, setPopupVisible] = useState(false);
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
      const handleSubmit = async (e) => {
        e.preventDefault();
      
        try {
          // Make a POST request to your server to add the patient
          const response = await axios.post('http://localhost:5000/patient/register', formData);
          setSuccessMessage('Patient added successfully');
          setPopupVisible(true);
        } catch (error) {
          if (error.response && error.response.status === 409) {
            // Handle the case where the patient already exists
            setErrorMessage('Patient already exists.');
            setPopupVisible(true);
          } else {
            // Handle other errors
            console.error('Error adding Patient', error);
          }
        }
      };
      
    
      const closePopup = () => {
        setPopupVisible(false);
        setSuccessMessage(null);
        setErrorMessage(null);
      };
  return (
    <div className="signUpContainerPt">
      <div className="signUpFormPt">
        <h2>SignUp</h2>
        {isPopupVisible && (
  <div className={`popup-overlay ${errorMessage ? 'error' : ''}`}>
    <div className="popup-content">
      <p>{successMessage || errorMessage}</p>
      <button
        className={errorMessage ? 'error-button' : ''}
        onClick={closePopup}
      >
        Close
      </button>
    </div>
  </div>
)}
        <form onSubmit={handleSubmit}>
        <div className="inputRowPt">
          <div className="inputContainerPt">
            <input
            type="text"
              placeholder="First name "
              value={formData.firstName}
              name="firstName"
              onChange={handleChange}
              className="inputBox"
            />
          </div>
          <div className="inputContainerPt">
            <input
            type="text"
              placeholder="Last name"
              value={formData.lastName}
              onChange={handleChange}
              name="lastName"
              className="inputBox"
            />
          </div>
        </div>
        <div className="inputContainerPt">
          <input 
          type="email"
          value={formData.email}
          onChange={handleChange}
          name="email"
          placeholder="Enter your email here" 
          className="inputBox" />
        </div>
        <div className="inputContainerPt">
            <input
            type="text"
              value={formData.username}
              name="username"
              placeholder="Enter your username here"
              onChange={handleChange}
              className="inputBox"
            />
          </div>
          <div className="inputContainerPt">
            <input
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password here"
              onChange={handleChange}
              className="inputBox"
            />
          </div>
        <div className="inputContainerPt">
          <select
          name="gender"
           value={formData.gender}
           onChange={handleChange}
           >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="inputContainerPt">
          <input
          type="text"
          name="address"
          value={formData.address}
              onChange={handleChange}
           placeholder="Enter your address here"
            className="inputBox" />
        </div>
        <div className="inputContainerPt">
          <input
           type="number"
           name="phone"
           value={formData.phone}
           onChange={handleChange}
           placeholder="Enter your phone here" 
           className="inputBox" />
        </div>
        <div className="inputContainerPt">
          {/* <input
            className="inputButtonPt"
            type="submit"
            value="Sign Up"
          /> */}
            <button type="submit" className="inputButtonPt">Sign up</button>
        </div>
       
        </form>
        <Link to="/login_patient">
      <p className="crAcc">Already have an account?SignIn</p>
      </Link>
      </div>
    </div>
  );
};

export default RegisterPatient;
