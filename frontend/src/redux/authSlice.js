import { createSlice } from "@reduxjs/toolkit";

const storageKey = "hotelAuth";

const getStoredAuth = () => {
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return {
      token: "",
      user: null,
    };
  }

  try {
    return JSON.parse(raw);
  } catch {
    localStorage.removeItem(storageKey);
    return {
      token: "",
      user: null,
    };
  }
};      //restore login after [age refresh]

const persistAuth = (state) => {     //saves login data into local storage
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      token: state.token,
      user: state.user,
    })
  );
};

const clearStoredAuth = () => {
  localStorage.removeItem(storageKey);
};

const initialState = getStoredAuth();

const authSlice = createSlice({   //create redux slice 
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {    //runs when user log in
      state.token = action.payload?.token || "";    //saves token
      state.user = action.payload?.user || null;   //saves user
      persistAuth(state);
    },
    logoutUser: (state) => {
      state.token = "";
      state.user = null;
      clearStoredAuth();
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
