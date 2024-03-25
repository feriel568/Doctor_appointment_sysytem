import React, { useState } from "react";
import { useNavigate , Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser , faDiceD6 , faUserMd , faUserCircle } from "@fortawesome/free-solid-svg-icons";
import "../Styles/sideMenuAdmin.css";

const SidebarAdmin = () => {
  
  const [profileDropdownActive, setProfileDropdownActive] = useState(false);
  const toggleProfileDropdown = () => {
    setProfileDropdownActive((prev) => !prev);
  };
  const navigate = useNavigate();
  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login_patient');
    // history.push('/login');
  }
  const userString = localStorage.getItem('user');
  
  // Parse the user information string into an object
  const user = userString ? JSON.parse(userString) : {};

  // Extract the first and last names
  const lastName = user.lastName || '';
  const firstName = user.firstName || '';

  return (
    <>
      <div className="wrapper">
        <div className="top_navbar">
          <div className="hamburger">
            <div className="hamburger__inner">
              <div className="one"></div>
              <div className="two"></div>
              <div className="three"></div>
            </div>
          </div>
          <div className="menu">
            <div className="logo">
            MedOnTime
            </div>
            <div className="right_menu">
              <ul>
                <li>
                  <FontAwesomeIcon icon={faUser} onClick={toggleProfileDropdown} />
                  <div className={`profile_dd ${profileDropdownActive ? 'active' : ''}`}>
                    <div className="dd_item">Profile</div>
                    <div className="dd_item">Change Password</div>
                    <div className="dd_item" onClick={handleLogOut}>Logout</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="main_container">
        <div className="sidebar">
          <div className="sidebar__inner">
            <div className="profile">
              <div className="img">
               
                {/* <img src="https://i.imgur.com/Ctwf8HA.png" alt="profile_pic" /> */}
                <FontAwesomeIcon icon={faUserCircle} />
              </div>
              <div className="profile_info">
                <p>Welcome</p>
                <p className="profile_name">{lastName} {firstName}</p>
              </div>
            </div>
            <ul>
  <li>
    
      <Link to="/dash_patient">
      <span className="icon"><FontAwesomeIcon icon={faDiceD6} /></span>
      <span className="title" style={{ fontSize: '16px' }}>Dashboard</span>
      </Link>
    
  </li>
  <li>
   
    <Link to="/docs">
      <span className="icon"><FontAwesomeIcon icon={faUser} /></span>
      <span className="title" style={{ fontSize: '16px' }}>Schedule</span>
    </Link>
    
  </li>
  <li>
    
    <Link to="/appointments_list">
      <span className="icon"><FontAwesomeIcon icon={faUserMd}  /></span>
      <span className="title" style={{ fontSize: '16px' }}>Appointments</span>
    </Link>
    
  </li>
</ul>

          </div>
        </div>
      </div>
    </>
  );
};

export default SidebarAdmin;

