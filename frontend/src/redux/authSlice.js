import { createSlice } from "@reduxjs/toolkit";

const storageKey = "hotelAuth";

const normalizeUser = (payload) => {
  if (!payload) return null;

  const validRoles = ["guest", "admin", "superAdmin"];
  const hasStaffFields = Boolean(payload.employeeId || payload.department);

  // If backend explicitly sent a valid role, trust it
  if (payload.role && validRoles.includes(payload.role)) {
    // Extra safety: if role is admin/superAdmin but no staff fields exist, demote to guest
    if ((payload.role === "admin" || payload.role === "superAdmin") && !hasStaffFields) {
      return { ...payload, role: "guest" };
    }
    return payload;
  }

  // No role from backend: infer from staff fields
  return {
    ...payload,
    role: hasStaffFields ? "admin" : "guest",
  };
};

const getStoredAuth = () => {
  const raw = localStorage.getItem(storageKey);

  if (!raw) {
    return {
      token: "",
      refreshToken: "",
      user: null,
    };
  }

  try {
    const parsed = JSON.parse(raw);
    return {
      token: parsed?.token || "",
      refreshToken: parsed?.refreshToken || "",
      user: normalizeUser(parsed?.user),
    };
  } catch {
    localStorage.removeItem(storageKey);
    return {
      token: "",
      refreshToken: "",
      user: null,
    };
  }
};      //restore login after [age refresh]

const persistAuth = (state) => {     //saves login data into local storage
  localStorage.setItem(
    storageKey,
    JSON.stringify({
      token: state.token,
      refreshToken: state.refreshToken,
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
      if (action.payload?.refreshToken) {
        state.refreshToken = action.payload.refreshToken; //saves refresh token
      }
      state.user = normalizeUser(action.payload?.user || action.payload?.admin);   //saves user
      persistAuth(state);
    },
    logoutUser: (state) => {
      state.token = "";
      state.refreshToken = "";
      state.user = null;
      clearStoredAuth();
    },
  },
});

export const { setCredentials, logoutUser } = authSlice.actions;
export default authSlice.reducer;
