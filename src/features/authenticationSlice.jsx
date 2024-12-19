import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user_id: null,          
  email: null,            
  first_name: null,      
  last_name: null,        
  isAuthenticated: false,
  is_admin: false,      
  is_active: false,      
  is_staff: false,        
  date_joined: null,      
};

export const userSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserAuthentication: (state, action) => {
      const {
        user_id, 
        email, 
        first_name, 
        last_name,
        isAuthenticated, 
        is_admin, 
        is_active,
        is_staff, 
        date_joined,
      } = action.payload;
     
      state.user_id = user_id;
      state.email = email;
      state.first_name = first_name;
      state.last_name = last_name;
      state.isAuthenticated = isAuthenticated;
      state.is_admin = is_admin;
      state.is_active = is_active;
      state.is_staff = is_staff;
      state.date_joined = date_joined;
    },
   
    logoutUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUserAuthentication, logoutUser } = userSlice.actions;
export default userSlice.reducer;