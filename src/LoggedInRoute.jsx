import React from 'react'
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';


const LoggedInRoute = ({ isLoggedIn, children }) => {
  const {token} = useSelector((state)=>state.auth)
    if (!token) {
        return <Navigate to="/login" />;
      }
      return children
}

export default LoggedInRoute