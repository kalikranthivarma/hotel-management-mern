# Frontend Interview Preparation Guide
## Project: MERN Hotel Management System

This document provides a comprehensive list of frontend-focused interview questions based on your project's architecture and implementation.

---

### 1. Project Architecture & Setup

**Q1: Can you explain the folder structure of your frontend and why you chose it?**
*   **Explanation:** The project follows a modular structure:
    *   `src/api`: Centralized API calls using Axios. This separates data fetching logic from UI components.
    *   `src/components`: Reusable UI elements (Navbar, Loader, etc.).
    *   `src/pages`: Main view components associated with routes.
    *   `src/redux`: Global state management logic using Redux Toolkit slices.
    *   `src/routes`: Handling protected and public routing logic.
*   **Why:** This promotes scalability, easier debugging, and reusability. By separating concerns, we ensure that changes in API logic don't require broad changes in UI components.

**Q2: Why did you use Vite instead of Create React App (CRA)?**
*   **Explanation:** Vite uses **esbuild** (written in Go) for dependency pre-bundling, which is significantly faster than Webpack (used by CRA). It also leverages native ES modules for development, providing nearly instant Hot Module Replacement (HMR).

---

### 2. React Core Concepts (Hooks & Components)

**Q3: How do you optimize component performance in your project? (Mention `React.memo`, `useCallback`, `useMemo`)**
*   **Explanation:** 
    *   **`React.memo`**: Used in `MenuCard` to prevent the component from re-rendering unless its props actually change.
    *   **`useCallback`**: Used for functions like `fetchMenuItems` or `handleDelete`. This ensures the function reference remains stable between renders, preventing child components that receive these functions as props from re-rendering unnecessarily.
    *   **`useMemo`**: Used for filtering `menuItems` based on search terms. It memoizes the filtered result so the filtering logic doesn't run on every render unless the list or search term changes.

**Q4: What is the purpose of `useDeferredValue` in your `Dining.jsx` page?**
*   **Explanation:** `useDeferredValue` is used for the search query. It allows React to defer updating the filtered list of menu items until the main UI (the input field itself) has finished rendering. This prevents the typing experience from feeling laggy or stuttery when filtering a large list of dishes.

**Q5: What is the difference between `useRef` and `useState` in your project?**
*   **Explanation:** 
    *   `useState` is used for data that affects the UI (like `menuItems` or `formData`). Changing it triggers a re-render.
    *   `useRef` (e.g., `menuCacheRef` in `Dining.jsx`) is used to persist values across renders *without* triggering a re-render. It's used here for manual caching of API responses to avoid redundant network calls.

---

### 3. State Management (Redux Toolkit)

**Q6: How do you handle Authentication state globally?**
*   **Explanation:** We use **Redux Toolkit** with an `authSlice`. 
    *   The slice manages the `user` object and `token`.
    *   We use `useSelector` to access auth state (e.g., checking roles for routing).
    *   The state is synchronized with `localStorage` so the user remains logged in after a page refresh.

**Q7: Why use Redux Toolkit over standard Redux?**
*   **Explanation:** RTK simplifies Redux by providing `createSlice` (which combines actions and reducers) and automatically using **Immer** under the hood, allowing us to write "mutating" logic that is safely converted into immutable updates. It also reduces boilerplate code significantly.

---

### 4. Routing & Security

**Q8: How did you implement Role-Based Access Control (RBAC) in the frontend?**
*   **Explanation:** We use a `PrivateRoute` wrapper component. 
    *   It takes `allowedRoles` as a prop.
    *   Inside, it checks the user's role from the Redux store.
    *   If the user isn't logged in or doesn't have the required role, it redirects them to the login or home page using `<Navigate />`.

**Q9: What is "Lazy Loading" and how is it used in your `App.jsx` and `Dining.jsx`?**
*   **Explanation:** We use `React.lazy()` and `Suspense`. 
    *   In `App.jsx`, pages are loaded lazily to split the main bundle.
    *   In `Dining.jsx`, complex tabs like `DiningCartTab` and `DiningReserveTab` are also loaded lazily. This ensures the initial "Dining" page loads quickly, and secondary components are only fetched when needed.

---

### 5. Data Fetching & API Interaction

**Q10: How do you handle JWT tokens for secure API requests?**
*   **Explanation:** We use **Axios Interceptors**. 
    *   A request interceptor in `src/api/axios.js` automatically retrieves the token from `localStorage` and attaches it to the `Authorization: Bearer <token>` header for every outgoing request.
    *   This ensures we don't have to manually add headers to every single API call.

**Q11: How do you handle file uploads (like menu item images)?**
*   **Explanation:** We use the `FormData` API. 
    *   Since JSON cannot transmit file binary data directly, we append fields (name, price) and the file object to a `FormData` instance.
    *   Axios then sends this with the correct `Content-Type: multipart/form-data`.

---

### 6. Styling & UI/UX

**Q12: Why did you choose Tailwind CSS for this project?**
*   **Explanation:** Tailwind allows for rapid UI development using utility classes. It provides:
    *   **Consistency:** Using a predefined design system (colors, spacing).
    *   **Performance:** It purges unused CSS, resulting in very small CSS files.
    *   **Responsiveness:** Easy handling of mobile/desktop views using prefixes like `md:` or `lg:`.

**Q13: How do you handle large lists efficiently (e.g., hundreds of bookings or menu items)?**
*   **Explanation:** We utilize **Windowing/Virtualization** via libraries like `react-window`. This ensures only the items currently visible on the screen are rendered in the DOM, drastically improving performance for large datasets.

---

### 7. Performance & Advanced UX

**Q14: Explain how you optimize image loading for the Dining menu.**
*   **Explanation:** 
    *   We use the `loading="lazy"` attribute for non-priority images.
    *   We use `decoding="async"` to prevent image decoding from blocking the main thread.
    *   We handle fallback images via a data URI SVG if the image path is missing, preventing broken image icons.

---

### Practical Interview Tips:
1.  **Be Specific:** Mention filenames (e.g., "In `AdminMenuManagement.jsx`, I used `useMemo` to...") to show you truly know the code.
2.  **Problem-Solution Approach:** Instead of just saying "I used Redux," say "I used Redux to solve the problem of prop-drilling authentication data across the app."
3.  **Performance Matters:** Always mention that you care about speed (Lazy loading, Memoization, useDeferredValue).
