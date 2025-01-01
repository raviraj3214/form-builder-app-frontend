const URL = import.meta.env.VITE_BACKEND_URL;

// Register new user
export const registerUser = async (data) => {
  return fetch(`${URL}/user/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// Login user
export const userLogin = async (data) => {
  return fetch(`${URL}/user/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });
};

// Update user
export const UpdateUser = async (id, data) => {
  return fetch(`${URL}/user/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

// Share workspace via mail
export const ShareWorkSpaceViaMail = async (id, data) => {
  return fetch(`${URL}/user/share/${id}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
};

// Get my workspaces
export const getMyWorkSpaces = async () => {
  return fetch(`${URL}/user/my-workspaces`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

// Get workspace folders/forms
export const getMyWorkSpacesFolderForms = async (id) => {
  return fetch(`${URL}/user/my-workspaces/${id}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
  });
};

// Accept workspace invite
export const acceptWorkspaceInvite = async (inviterId, permission) => {
  return fetch(`${URL}/user/accept-invite`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ inviterId, permission }),
  });
};
