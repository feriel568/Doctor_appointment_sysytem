import React from "react";
import "../Styles/registerPatient.css";

const RegisterPatient = () => {
  return (
    <div className="signUpContainerPt">
      <div className="signUpFormPt">
        <h2>SignUp</h2>
        <div className="inputRowPt">
          <div className="inputContainerPt">
            <input
              placeholder="First name "
              className="inputBox"
            />
          </div>
          <div className="inputContainerPt">
            <input
              placeholder="Last name"
              className="inputBox"
            />
          </div>
        </div>
        <div className="inputContainerPt">
          <input placeholder="Enter your email here" className="inputBox" />
        </div>
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
          </div>
        <div className="inputContainerPt">
          <select>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="inputContainerPt">
          <input placeholder="Enter your address here" className="inputBox" />
        </div>
        <div className="inputContainerPt">
          <input
            className="inputButtonPt"
            type="button"
            value="Sign Up"
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterPatient;
