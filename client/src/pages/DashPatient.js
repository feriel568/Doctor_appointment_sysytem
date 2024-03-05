import React , { useState , useEffect}  from 'react';
import axios from 'axios';
import SidebarPatient from '../components/SidebarPatient'



const DashPatient = () =>{

    const [totalApps, setTotalApps] = useState(0)

    useEffect(() => {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        const fetchData = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/appointment/patient/totalAppointments/${storedUserDetails.id}`);
            const totalAppsFromServer = response.data;
            setTotalApps(totalAppsFromServer);
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
    
        fetchData();
      }, []);

return (
    <div>
        <SidebarPatient />
        <div className="statistics">

        <div className="cds">
        <h1>Total appointments</h1>
        <p>{totalApps}</p>
        </div>




</div>
    </div>
);
}

export default DashPatient;