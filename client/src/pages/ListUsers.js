import React, { useState, useEffect } from "react";
import axios from "axios";
import SidebarAdmin from "../components/SidebarAdmin.js";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import '../Styles/usersList.css';

const ListUsers = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const response = await axios.get('http://localhost:5000/users/getAllUsers');
            const allUsers = response.data.admins.concat(response.data.doctors, response.data.patients);
            setUsers(allUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const handleSearch = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/users/searchUser?name=${searchQuery}`);
            const searchResults = response.data.admins.concat(response.data.doctors, response.data.patients);
            setUsers(searchResults);
        } catch (error) {
            console.error('Error searching users:', error);
        }
    };

    const handleDelete = async (userId, userRole) => {
        try {
            let endpoint;

            if (userRole === 'admin') {
                endpoint = `admin/delete`;
            } else if (userRole === 'doctor') {
                endpoint = `doctor/delete`;
            } else {
                endpoint = `patient/delete`;
            }

            await axios.delete(`http://localhost:5000/${endpoint}/${userId}`);
            setUsers(prevUsers => prevUsers.filter(user => user._id !== userId));
        } catch (error) {
            console.error('Error deleting user:', error);
        }
    };

    return (
        <div>
            <SidebarAdmin />
            <div className="containerUsers">
                <div className="searchContainer">
                    <input
                        type="text"
                        placeholder="Search by name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={handleSearch} className="sBtn">Search</button>
                </div>
                <table className="tableUsers">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user._id}>
                                <td>{user._id}</td>
                                <td>{user.firstName} {user.lastName}</td>
                                <td>{user.email}</td>
                                <td>{user.role}</td>
                                <td className="actions">
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <FontAwesomeIcon
                                        icon={faTrash}
                                        className="deleteIcon"
                                        onClick={() => handleDelete(user._id, user.role)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ListUsers;
