import React from "react"; 
import MealTicketPurchase from "./components/MealTicketPurchase";
import MealCongestionGraph from "./components/MealCongestionGraph";
import Login from "./components/Login";
import Register from "./components/Register";
import Mypage from "./components/mypage/Mypage";
import AllergyInfoPage from "./components/mypage/AllergyInfoPage";
import AccountManagementPage from "./components/mypage/AccountManagementPage";
import RequireAdmin from "./components/mypage/RequireAdmin";
import AdminDashboard from "./components/mypage/AdminDashboard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import FavoritesPage from "./components/mypage/FavoritesPage";

function App() { 
  return ( 
    <UserProvider>
      <BrowserRouter basename="/team6">
        <Routes>
          {/* Public pages */}
          <Route path="/login" element={<Login />} /> 
          <Route path="/register" element={<Register />} />

          {/* Meal features (token not needed) */}
          <Route path="/ticket" element={<MealTicketPurchase />} />
          <Route path="/congestion" element={<MealCongestionGraph />} />

          {/* User pages (token automatically attached) */}
          <Route path="/mypage" element={<Mypage />} />
          <Route path="/mypage/allergies" element={<AllergyInfoPage />} />
          <Route path="/mypage/account" element={<AccountManagementPage />} />
          <Route path="/mypage/favorites" element={<FavoritesPage/>} />

          {/* Admin-only pages (RequireAdmin reads UserContext.role) */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <AdminDashboard />
              </RequireAdmin>
            }
          />
        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}

export default App;
