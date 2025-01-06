import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import styles from "./compStyles/workNav.module.css";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../Contexts/ThemeProvider";
import toast from "react-hot-toast";

const WorkSpaceNavbar = ({ userData, setShowShareModel, myWorkSpaces, handleSelectedWorkSpace }) => {
  const { light, setLight } = useContext(ThemeContext);
  const [toggleBack, setToggleBack] = useState(!light);
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", light ? "light" : "");
  }, [light]);

  const handleSelectChange = (event) => {
    const value = event.target.value;
    switch (value) {
      case "Settings":
        navigate(`/settings/${userData?.id}`);
        break;
      case "Logout":
        localStorage.removeItem("token");
        toast.success("Logged out successfully");
        navigate("/");
        break;
      default:
        handleSelectedWorkSpace(value);
        console.log(value);
    }
  };

  const handleToggleChange = () => {
    setToggleBack((prev) => !prev);
    setLight((prev) => !prev);
    console.log("Toggle is now:", toggleBack ? "Checked" : "Unchecked");
  };

  return (
    <div className={styles.workNavbar}>
      <div className={styles.ctrlOptions}>
        <select onChange={handleSelectChange}>
          <option value={userData?.id}>{userData?.username}'s workspace</option>
          {myWorkSpaces &&
            myWorkSpaces.map((workspace, index) => (
              <option value={workspace.userId._id} key={index}>
                {workspace.userId.username}'s workspace
              </option>
            ))}
          <option value="Settings">Settings</option>
          <option value="Logout">Logout</option>
        </select>
      </div>
      <div className={styles.userCtrl}>
        <div className={styles.toggle}>
          Light
          <input
            type="checkbox"
            name="checkbox"
            id="toggle"
            checked={toggleBack}
            onChange={handleToggleChange}
          />
          <label htmlFor="toggle"></label>
          Dark
        </div>
        {setShowShareModel && (
          <div className={styles.share}>
            <button onClick={() => setShowShareModel(true)}>Share</button>
          </div>
        )}
      </div>
    </div>
  );
};

WorkSpaceNavbar.propTypes = {
  userData: PropTypes.object.isRequired,
  setShowShareModel: PropTypes.func,
  myWorkSpaces: PropTypes.array.isRequired,
  handleSelectedWorkSpace: PropTypes.func.isRequired,
};

export default WorkSpaceNavbar;
