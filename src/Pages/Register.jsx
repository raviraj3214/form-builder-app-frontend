import React, { useState } from "react";
import styles from "./pageStyles/register.module.css";
import triangle2 from "../assets/triangle2.png";
import circle1 from "../assets/Ellipse 1.png";
import circle2 from "../assets/Ellipse 2.png";
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/userApis";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [confirmPass, setConfirmPass] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); // New loading state

  // Validate Input Fields
  const validateForm = () => {
    const newError = {};
    if (!formData.username.trim()) newError.username = "Username is Required!";
    if (!formData.email.trim()) newError.email = "Email is Required!";
    if (!formData.password.trim()) newError.password = "Password is Required!";
    if (!confirmPass.trim()) newError.confirmPass = "Field Required!";
    if (formData.password.trim() !== confirmPass) newError.confirmPass = "Enter same password in both fields";
    setErrors(newError);
    return Object.keys(newError).length === 0;
  };

  // Register new user
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return toast.error("All fields Required");
    }

    setLoading(true); // Set loading to true when the API call starts
    try {
      const res = await registerUser(formData);
      const data = await res.json();
      if (res.status === 200) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Set loading to false when the API call completes
    }

    setFormData({
      username: "",
      email: "",
      password: "",
    });
    setConfirmPass("");
  };

  return (
    <>
      <div className={styles.BackArro}>
        <FaArrowLeft size={28} onClick={() => navigate("/")} />
      </div>
      <div className={styles.container}>
        <form onSubmit={handleFormSubmit}>
          <div className={styles.logindiv}>
            <div className={styles.email}>
              <label style={errors.username && { color: "red" }}>Username</label>
              <input
                type="text"
                placeholder="Enter your username"
                name="username"
                value={formData.username}
                style={errors.username && { border: "1px solid red" }}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              />
              <p style={{ visibility: errors.username ? "visible" : "hidden" }}>
                {errors.username || "Field Requires"}
              </p>
            </div>
            <div className={styles.email}>
              <label style={errors.email && { color: "red" }}>Email</label>
              <input
                type="text"
                placeholder="Enter your email"
                name="email"
                value={formData.email}
                style={errors.email && { border: "1px solid red" }}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              />
              <p style={{ visibility: errors.email ? "visible" : "hidden" }}>
                {errors.email || "Field Required"}
              </p>
            </div>
            <div>
              <label style={errors.password && { color: "red" }}>Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                name="password"
                value={formData.password}
                style={errors.password && { border: "1px solid red" }}
                onChange={(e) =>
                  setFormData({ ...formData, [e.target.name]: e.target.value })
                }
              />
              <p style={{ visibility: errors.password ? "visible" : "hidden" }}>
                {errors.password || "Field Required"}
              </p>
            </div>
            <div>
              <label style={errors.confirmPass && { color: "red" }}>Confirm Password</label>
              <input
                type="password"
                placeholder="Enter Password"
                name="confirmPassword"
                style={errors.confirmPass && { border: "1px solid red" }}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
              <p style={{ visibility: errors.confirmPass ? "visible" : "hidden" }}>
                {errors.confirmPass || "Field Required"}
              </p>
            </div>
            <div>
              <button className={styles.loginButton} type="submit" disabled={loading}>
                {loading ? "Loading..." : "Sign Up"}
              </button>
            </div>
            <div style={{ textAlign: "center", fontSize: "15px", fontWeight: "200" }}>
              OR
            </div>
            <div>
              <button className={styles.loginButton}>
                <div>
                  <FcGoogle size={30} />
                </div>
                Sign Up with Google
              </button>
            </div>
          </div>
          <div className={styles.register}>
            <p>
              Already have an account? <a onClick={() => navigate("/login")}>Login</a>
            </p>
          </div>
        </form>
      </div>
      <div className={styles.triangle}>
        <img src={triangle2} />
      </div>
      <div className={styles.circleOne}>
        <img src={circle1} />
      </div>
      <div className={styles.circleTwo}>
        <img src={circle2} />
      </div>
    </>
  );
};

export default Register;
