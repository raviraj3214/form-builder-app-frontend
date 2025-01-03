import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { IoIosLogOut } from "react-icons/io";
import { IoEyeOutline } from "react-icons/io5";
import styles from './Settings.module.css';
import toast from "react-hot-toast";
// import { updateUser } from "../../api/User";
import { useUpdateInfoMutation } from '../../../redux/slices/authApiSlice';

const Settings = ({ handleLogout }) => {
  const [username, setUsername] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [updateInfo] = useUpdateInfoMutation()
  const navigate = useNavigate();

  const userId = localStorage.getItem('user'); 

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const response = await updateInfo({username:username, email:email, newPassword:newPassword, oldPassword:oldPassword, userId:userId}).unwrap();
      toast.success("User updated successfully!");
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error(error.message || "Error updating user.");
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Settings</h1>
      <form onSubmit={submitHandler} className={styles.form}>
        <div className={styles.inputGroup}>
          <input
            type="text"
            placeholder="Name"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles.inputGroup}>
          <input
            type="email"
            placeholder="Update Email"
            className={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="button" className={styles.eyeButton}>
            <IoEyeOutline size={"20px"} color="#D0D0D0" />
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showOldPassword ? "text" : "password"}
            placeholder="Old Password"
            className={styles.input}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowOldPassword(!showOldPassword)}
          >
            <IoEyeOutline size={"20px"} color="#D0D0D0" />
          </button>
        </div>
        <div className={styles.inputGroup}>
          <input
            type={showNewPassword ? "text" : "password"}
            placeholder="New Password"
            className={styles.input}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <button
            type="button"
            className={styles.eyeButton}
            onClick={() => setShowNewPassword(!showNewPassword)}
          >
            <IoEyeOutline size={"20px"} color="#D0D0D0" />
          </button>
        </div>
        <button type="submit" className={styles.updateButton}>Update</button>
      </form>
      <button 
        onClick={() => {
          handleLogout();
          navigate('/');
        }}
        className={styles.logoutButton}
      >
        <span><IoIosLogOut size={"20px"} /></span>
        <span> Log out</span>
      </button>
    </div>
  );
};

export default Settings;