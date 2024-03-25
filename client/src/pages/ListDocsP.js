import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SidebarPatient from '../components/SidebarPatient';
import '../Styles/listDocsP.css';
import { Link } from 'react-router-dom'



const Docs = ()=> {
    const [doctors,setDoctors] = useState([]);
    const [searchQuery, setSearchQuery] = useState(''); 
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

      const handleSearch = async () => {
        const res = await axios.get(`http://localhost:5000/doctor/searchDoctor?search=${searchQuery}`)
        setDoctors(res.data);
      }
      return (
        <div>
            <SidebarPatient />
            <div className='docsC'>
                <div className="sr1">
                    <input
                        type="text"
                        placeholder="Search by name or specialization"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button className="sBtn1" onClick={handleSearch}>Search</button>
                </div>
                <div className="dC">
                    {doctors.map(doctor => (
                        <div key={doctor._id} className="infoDoc">
                            <h3><strong>{doctor.firstName} {doctor.lastName}</strong></h3>
                            <p><strong>Email:</strong> {doctor.email}</p>
                            <p><strong>Specialization:</strong> {doctor.specialization}</p>
                            <p><strong>Phone: </strong>{doctor.phone}</p>
                            <p><strong>Address:</strong> {doctor.address}</p>
                            <p><strong>Fee: </strong>{doctor.fee}</p> 
                             <p><strong>Days of word:</strong> {doctor.days.join(', ')}</p> 
                             <p><strong>Start time:</strong> {doctor.startTime}</p>
                            <p><strong>End time:</strong> {doctor.endTime}</p> 
                            <Link to={`/pick_appointment/${doctor._id}`}>
                             <button type="button" className='pick'>Pick appointment</button>
                             </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
    

}

export default Docs;