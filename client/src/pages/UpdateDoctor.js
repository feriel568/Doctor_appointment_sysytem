import React , {useState , useEffect} from "react";
import SidebarAdmin from "../components/SidebarAdmin.js";
import axios from "axios";
import { useParams } from "react-router-dom";


const UpdateDoctor = ()=>{
    const  [formData ,setFormData] = useState({
        firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    address: "",
    phone: "",
    fee: "",
    specialization: "",
    startTime: "",
    endTime: "",
    });

    
    const { doctorId } = useParams();

    const [updateMessage,setUpdateMessage] = useState(null);
    const [isPopupVisible,setPopupVisible] = useState(false); 

    useEffect(() => {
      const fetchDoctorData = async () => {
        try {
          // Get doctor details by ID
          const response = await axios.get(`http://localhost:5000/doctor/getDoctor/${doctorId}`);
          const doctorData = response.data;
  
          // Set the form data with the fetched doctor details
          setFormData(doctorData);
        } catch (error) {
          console.error("Error fetching doctor details:", error);
        }
      };
  
      // Fetch doctor details when the component mounts
      fetchDoctorData();
    }, [doctorId]);
  
    const handleChange = (event) => {
      const { name, value } = event.target;
      setFormData({ ...formData, [name]: value });
    };
  
    const handleSubmit = async (event) => {
      event.preventDefault();
  
      try {
        // Make an HTTP request to update doctor data
        const response = await axios.put(`http://localhost:5000/doctor/update/${doctorId}`, formData);
        setUpdateMessage('Doctor updated successfully');
        setPopupVisible(true);
  
        // Handle success or show a message to the user
        console.log("Doctor updated successfully:", response.data);
      } catch (error) {
        // Handle error or show an error message to the user
        console.error("Error updating doctor:", error);
      }
    };

    const closePopup = () =>{
        setPopupVisible(false);
        setUpdateMessage(null);
    }


    return (
        <div>

            <SidebarAdmin />
            return (
    <div>
      <SidebarAdmin />
      <div className="docForm">
        <h2>Update Doctor</h2>
        {isPopupVisible && (
            <div className="popup-overlay">
            <div className="popup-content">
              <p>{updateMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
      
        <form onSubmit={handleSubmit}>
          <div className="formRow">
            <label htmlFor="firstName">First Name:</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="lastName">Last Name:</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>

          {/* <div className="formRow">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div> */}

          <div className="formRow">
            <label htmlFor="gender">Gender:</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="formRow">
            <label htmlFor="address">Address:</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="fee">Fee:</label>
            <input
              type="number"
              id="fee"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="specialization">Specialization:</label>
            <input
              type="text"
              id="specialization"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="startTime">Start time:</label>
            <input
              type="text"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
            />
          </div>

          <div className="formRow">
            <label htmlFor="endTime">End time:</label>
            <input
              type="text"
              id="endTime"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
            />
          </div>

          
          <button type="submit">Update Doctor</button>
        </form>
      </div>
    </div>
  );

            


        </div>

    );
} 

export default UpdateDoctor;
