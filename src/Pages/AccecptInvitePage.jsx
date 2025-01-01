import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { acceptWorkspaceInvite } from '../api/userApis'; 

const AcceptInvitePage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const inviterId = queryParams.get('inviterId');
    const permission = queryParams.get('permission');
    const token = localStorage.getItem("token")

    if (token) {
      acceptWorkspaceInvite(inviterId, permission)
        .then(response => response.json())
        .then(data => {
           
          if (data.success) {
            toast.success(data.message);
            navigate('/workspace'); 
          } else {
            toast.error("Failed to accept invite. Please try again.");
          }
        })
        .catch(error => {
          toast.error("An error occurred. Please try again.");
          console.error('Error:', error);
        });
    } else {
      toast.error("Please log in to accept the invite.");
      navigate('/login'); 
    }
  }, [location, navigate]);

  return (
    <div>
      <h1>Processing your invitation...</h1>
    </div>
  );
};

export default AcceptInvitePage;
