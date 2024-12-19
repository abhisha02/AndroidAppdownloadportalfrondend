import { jwtDecode } from "jwt-decode";
import axios from "axios";


// Function to refresh and update the user token
const updateUserToken = async () => {
  const refreshToken = localStorage.getItem("refresh");
  const baseURL = "http://127.0.0.1:8000/";

  if (!refreshToken) return false; // Handle no refresh token case

  try {
    const res = await axios.post(`${baseURL}api/token/refresh/`, { refresh: refreshToken });

    if (res.status === 200) {
      // Store new tokens
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Decode new access token
      const decoded = jwtDecode(res.data.access);

      // Return user authentication data
      return {
        user_id: decoded.user_id,
        email: decoded.email,
        first_name: decoded.first_name,
        last_name: decoded.last_name,
        isAuthenticated: true,
        is_admin: decoded.is_admin,
        is_active: decoded.is_active,
        is_staff: decoded.is_staff,
        date_joined: decoded.date_joined,
      };
    }
  } catch (error) {
    localStorage.clear();
    return false;
  }
};

// Function to check user authentication status
const isAuthUser = async () => {
  const accessToken = localStorage.getItem("access");

  if (!accessToken) {
    return { isAuthenticated: false }; 
  }

  const currentTime = Date.now() / 1000;
  const decoded = jwtDecode(accessToken);

  if (decoded.exp > currentTime) {
    // Token is valid, return authentication data
    return {
      user_id: decoded.user_id,
      email: decoded.email,
      first_name: decoded.first_name,
      last_name: decoded.last_name,
      isAuthenticated: true,
      is_manager: decoded.is_manager,
      is_active: decoded.is_active,
      is_staff: decoded.is_staff,
      date_joined: decoded.date_joined,
    };
  } else {
    // Token expired, attempt to refresh it
    const updateSuccess = await updateUserToken();
    return updateSuccess;
  }
};

export default isAuthUser;