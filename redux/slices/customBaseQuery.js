import { fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { setUser, clearUser } from './authSlice';

// Base query with token handling
const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_BACKEND_URL,
  credentials: 'include',
  prepareHeaders: (headers, { getState }) => {
    const token = getState().auth.token; 
    const workspaceId = getState().auth.selectedWorkspaceId;
    headers.set('X-Workspace-Id', workspaceId);

    if (token) {
      headers.set('Authorization', `Bearer ${token}`); 
      // console.log("header token", token)
    }
    headers.set('Content-Type', 'application/json');
    return headers;
  },
});
const customBaseQuery = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);
  
    // Look for a token in the response body
    const newToken = result?.data?.token;
  
    if (newToken) {
      console.log('New token received:', newToken);
      api.dispatch(setUser({ token: newToken })); 
    }
  
    // Handle unauthorized (401) errors
    if (result.error && result.error.status === 401) {
      console.warn('Unauthorized request, logging out...');
      api.dispatch(clearUser());
    }
  
    return result;
  };
  

// // Custom base query to check for new tokens and update Redux state
// const customBaseQuery = async (args, api, extraOptions) => {
//   const stateToken = api.getState().auth.token; // Get token from Redux state

//   // Perform the original request
//   let result = await baseQuery(args, api, extraOptions);

//   console.log('API request result:', result); // Debugging: Log the result

//   // Check for a new token in response headers or data
//   const backendToken = result?.data?.token || result?.meta?.response?.headers?.get('Authorization')?.split(' ')[1];
//   console.log("backend token", backendToken)
//   // If a new token is received and it differs from Redux state, update the Redux state
//   if (backendToken && backendToken !== stateToken) {
//     console.log('Token mismatch detected. Updating Redux state with new token:', backendToken);
//     api.dispatch(setUser({ token: backendToken }));
//   }

//   // Handle failed authentication or expired tokens
//   if (result.error && result.error.status === 401) {
//     console.warn('Authentication failed or token expired. Logging out.');
//     api.dispatch(clearUser()); // Clear user data
//   }

//   return result; // Return the result to the calling function
// };

export default customBaseQuery;
