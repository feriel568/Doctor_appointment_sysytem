import React, { useState } from "react";
import SidebarPatient  from "../components/SidebarPatient";
import axios from "axios"; // Import axios for making HTTP requests
import '../Styles/changePassword.css';

const ChangePasswordPatient = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPassword, setConfirmNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!oldPassword || !newPassword || !confirmNewPassword) {
            setError("Please fill in all fields.");
            return;
        }
        
        if (newPassword !== confirmNewPassword) {
            setError("New password and confirm new password do not match.");
            return;
        }

        const storedUserDetails = JSON.parse(localStorage.getItem('user'));
        try {
    

            const response = await axios.put(`http://localhost:5000/patient/changePassword/${storedUserDetails.id}`, {
                oldPassword,
                newPassword,
                confirmNewPassword
            });
            if(response.data.message ==='Old Password incorrect' || response.data.message ==='New password and confirm new password do not match'){
                setError(response.data.message)
                setMessage("");
            }
            else {
                setMessage(response.data.message);
                setError("");

            }
        } catch (error) {
            console.error(error);
            setMessage("Internal server error");
        }
    };

    const handleReset = () => {
        setOldPassword("");
        setNewPassword("");
        setConfirmNewPassword("");
        setError("");
        setMessage("");
    };

    return (
        <div>
            <SidebarPatient />
            <div className="passwordCt">
                <form className="change" onSubmit={handleSubmit}>
                    <div className="ligne">
                        <label>Old password :</label>
                        <input type="password" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} />
                    </div>
                    <div className="ligne">
                        <label>New password :</label>
                        <input type="password" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                    </div>
                    <div className="ligne">
                        <label>Confirm new password :</label>
                        <input type="password" name="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
                    </div>
                    <div className="btnG">
                        <button type="submit" className="g1">Submit</button>
                        <button type="reset" className="g2" onClickCapture={handleReset}>Reset</button>
                    </div>
                    {error && <div className="error">{error}</div>}
                    {message && <div className="success">{message}</div>}
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordPatient;
