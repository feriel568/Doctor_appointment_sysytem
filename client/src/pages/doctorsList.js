import React , {useState , useEffect} from "react";
import axios from 'axios'; 
import { Link } from 'react-router-dom'
import SidebarAdmin from "../components/SidebarAdmin.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPen } from '@fortawesome/free-solid-svg-icons';
import '../Styles/doctorsList.css';

export const DoctorsList = () => {
      const [doctors,setDoctors] = useState([]);
      const [searchQuery, setSearchQuery] = useState("");

   

      useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:5000/doctor/allDoctors');
            setDoctors(response.data);
          } catch (error) {
            console.error('Error fetching doctors:', error);
          }
        };
    
        fetchData();
      }, []);

      const deleteDoc = async (id) => {
        try {
          const response = await axios.delete(`http://localhost:5000/doctor/delete/${id}`);
          setDoctors((prevDoctors) => prevDoctors.filter((doctor) => doctor._id !== id));
          console.log(response.data); // Log the response data
        } catch (error) {
          console.error('Error deleting document:', error.message); // Log the error message
          if (error.response) {
            console.error('Error response:', error.response.data); // Log the error response
          }
        }
      };
      const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/doctor/searchDoctor?search=${searchQuery}`);
            setDoctors(response.data);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };
  return (
    <div>
      <SidebarAdmin />
      

      <div className="containerDoc">
        <Link to="/add_doctor">
        <button type="button" className="addDoc">
           + Add doctor 
        </button>
        </Link>
        <div className="searchContainer">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="sBtn">Search</button>
                </div>
        <table className="tableDoc">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th> 
              <th>Specialization</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Array.isArray(doctors) && doctors.length > 0 ? (
              doctors.map((doctor) => (
                <tr key={doctor._id}>
                  <td>{doctor._id}</td>
                  <td>{doctor.firstName} {doctor.lastName}</td>
                  <td>{doctor.email}</td>
                  <td>{doctor.phone}</td>
                  <td>{doctor.specialization}</td>
                  <td className="actions">
                    <Link to={`/update_doctor/${doctor._id}`}>
                      <FontAwesomeIcon icon={faPen} className="editIcon" />&nbsp;&nbsp;&nbsp;&nbsp;
                    </Link>
                    <FontAwesomeIcon icon={faTrash} className="deleteIcon" onClick={() => deleteDoc(doctor._id)} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">No doctors available</td>
              </tr>
            )}
          </tbody>
        </table>
        
        
      </div>
    </div>
  );
};

export default DoctorsList;
