import { createSlice } from "@reduxjs/toolkit";

const storageKey = "hotelAuth";

const normalizeUser = (payload) => {
  if (!payload) return null;

  if (payload.role) {
    return payload;
  }

  const isStaffAccount = Boolean(payload.employeeId || payload.department);

  return {
    ...payload,
    role: isStaffAccount ? "admin" : "guest",
  };
};

const getStoredAuth = () => {
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return {
      token: "",
      user: null,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || "",
      user: normalizeUser(parsed?.user),
    };
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
      state.user = normalizeUser(action.payload?.user || action.payload?.admin);   //saves user
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
