import React, { useState , useEffect} from 'react';
import SidebarDoctor from '../components/SidebarDoctor';
import { useParams , useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../Styles/createMedicalDossier.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAdd } from '@fortawesome/free-solid-svg-icons';

const CreateDossierMedical = () => {
    const navigate = useNavigate();

    const { patientId } = useParams();
    const [formDataPatient, setFormDataPatient] = useState({
        firstName: "",
        lastName: "",
    });
    const [formDataDoctor, setFormDataDoctor] = useState({
        firstName: "",
        lastName: "",
    });
    const [notes, setNotes] = useState([]);
    const [meds, setMeds] = useState([]);
    const [isPopupVisible, setPopupVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

    useEffect(() => {
        const fetchPatient = async () => {
          try {
            const response = await axios.get(`http://localhost:5000/patient/infos/${patientId}`);
            const patient = response.data;
            console.log(patient)
            setFormDataPatient(patient);
          } catch (error) {
            console.error("Error fetching patient details:", error);
          }
        };
        fetchPatient();
      }, [patientId]);

      
  useEffect(() => {
    const fetchDoctorData = async () => {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
      try {
        const response = await axios.get(`http://localhost:5000/doctor/infos/${storedUserDetails.id}`);
        const doctorData = response.data;
        console.log(doctorData)
        setFormDataDoctor(doctorData);
      } catch (error) {
        console.error("Error fetching doctor details:", error);
      }
    };
    fetchDoctorData();
  }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormDataPatient({ ...formDataPatient, [name]: value });
    };

    const handleChange1 = (event) => {
        const { name, value } = event.target;
        setFormDataDoctor({ ...formDataDoctor, [name]: value });
    };

    const handleAddNote = () => {
        setNotes([...notes, '']);
    };

    const handleNoteChange = (index, event) => {
        const newNotes = [...notes];
        newNotes[index] = event.target.value;
        setNotes(newNotes);
    };

    const handleAddMed = () => {
        setMeds([...meds, '']);
    };

    const handleMedChange = (index, event) => {
        const newMeds = [...meds];
        newMeds[index] = event.target.value;
        setMeds(newMeds);
    };

    const handleCreateDossierMedical = async () => {
        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        try {
            const response = await axios.post(`http://localhost:5000/dossier/create/${storedUserDetails.id}/${patientId}`, {
                notes: notes,
                meds: meds
            });
            console.log(response.data); 
            setSuccessMessage(response.data);
            setPopupVisible(true);

        } catch (err) {
            console.log(err);
        }
    }

    const closePopup = () => {
        setPopupVisible(false);
        setSuccessMessage(null);
        navigate('/mypatients');
      };
    

    return (
        <div>
            <SidebarDoctor />
            {isPopupVisible && (
          <div className="popup1">
            <div className="popup-content1">
              <p>{successMessage}</p>
              <button onClick={closePopup}>Close</button>
            </div>
          </div>
        )}
            <div className="dossierCn">
                <div className="patientInput">
                    <label className='lb'>Patient</label>
                    <input
                        type="text"
                        onChange={handleChange}
                        value={`Mr/Mrs. ${formDataPatient.firstName} ${formDataPatient.lastName}`}
                    />
                </div>

                <div className="DocInput">
                    <label className='lb'>Doctor</label>
                    <input
                        type="text"
                        onChange={handleChange1}
                        value={`Mr/Mrs. ${formDataDoctor.firstName} ${formDataDoctor.lastName}`}
                    />
                </div>

                <div className="notesInput">
                    <label className='lb'>Notes</label>
                    {notes.map((note, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={note}
                                onChange={(event) => handleNoteChange(index, event)}
                                style={{ marginBottom: '10px' }}
                            />
                        </div>
                    ))}
                   
                    <FontAwesomeIcon icon={faAdd}    onClick={handleAddNote}/>
                </div>

                <div className="medsInput">
                    <label className='lb'>Medications</label>
                    {meds.map((med, index) => (
                        <div key={index}>
                            <input
                                type="text"
                                value={med}
                                onChange={(event) => handleMedChange(index, event)}
                                style={{ marginBottom: '10px' }}
                            />
                        </div>
                    ))}
                    <FontAwesomeIcon icon={faAdd} onClick={handleAddMed}/>
                </div>

                <button type="submit" className='btnApp' onClick={handleCreateDossierMedical} >
              Create
            </button> 
            </div>

            
        </div>
    );
}

export default CreateDossierMedical;
