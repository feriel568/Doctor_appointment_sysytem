import SidebarDoctor from '../components/SidebarDoctor';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons';
import '../Styles/appointmentsPatientList.css';
import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const PatientsListDoc = () => {

   

    return (
        <div>
            <SidebarDoctor />
          
        </div>
    );

}

export default PatientsListDoc;