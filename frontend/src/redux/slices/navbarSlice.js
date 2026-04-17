import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  mobileMenuOpen: false,
  isLoggedIn: false,
}

const navbarSlice = createSlice({
  name: 'navbar',
  initialState,
  reducers: {
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen
    },
    closeMobileMenu: (state) => {
      state.mobileMenuOpen = false
    },
    toggleAuth: (state) => {
      state.isLoggedIn = !state.isLoggedIn
    },
  },
})

export const { toggleMobileMenu, closeMobileMenu, toggleAuth } =
  navbarSlice.actions

export default navbarSlice.reducer

