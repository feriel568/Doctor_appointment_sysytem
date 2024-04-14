import React, { useState, useEffect } from 'react';
import SidebarPatient from '../components/SidebarPatient';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../Styles/viewMedReport.css";

const GetMedicalReportDetails = () => {
    const { dossierId } = useParams();
    const [notes, setNotes] = useState([]);
    const [meds, setMeds] = useState([]);
    const [doctor, setDoctor] = useState(null);

    useEffect(() => {
        console.log("Fetching data...");
        const fetchData = async () => {
            try {
                // Fetch dossier details
                const response = await axios.get(`http://localhost:5000/dossier/getDossier/${dossierId}`);
                console.log("Data received:", response.data);
                const { notes, meds, doctor } = response.data;
                setNotes(notes);
                setMeds(meds);
                setDoctor(doctor);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
    
        fetchData();
    }, [dossierId]);
    

    return (
        <div>
            <SidebarPatient />
            <div className="Cn_med">
                <div className="cn_med_box">
                    {doctor && (
                        <div>
                            <h3>Doctor:</h3>
                            <p>{doctor.firstName} {doctor.lastName}</p>
                        </div>
                    )}
                    <div>
                        <h3>Notes:</h3>
                        <ul className="notes-list">
                            {notes.map((note, index) => (
                                <li key={index}>{note}</li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3>Medications:</h3>
                        <ul className="meds-list">
                            {meds.map((med, index) => (
                                <li key={index}>{med}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GetMedicalReportDetails;
