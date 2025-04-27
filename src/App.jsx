import React from "react"; 
import MealTicketPurchase from "./components/MealTicketPurchase";
import MealCongestionGraph from "./components/MealCongestionGraph";
import Login from "./components/Login";
import Register from "./components/Register";
import Mypage from "./components/mypage/Mypage"
import AllergyInfoPage from "./components/mypage/AllergyInfoPage";
import AccountManagementPage from "./components/mypage/AccountManagementPage";

import { BrowserRouter, Routes, Route, Link} from "react-router-dom";


function App() { 
    return ( 
        <BrowserRouter basename='/team6'>
            <Routes>
                <Route path="/ticket" element={<MealTicketPurchase/>}/>
                <Route path="/congestion" element={<MealCongestionGraph />} />
                <Route path="/login" element={<Login />} /> 
                <Route path="/register" element={<Register />} />
                <Route path="/mypage" element={<Mypage />} />
                <Route path="/mypage/allergies" element={<AllergyInfoPage />} />
                <Route path="/mypage/account" element={<AccountManagementPage />} />
            </Routes>
        </BrowserRouter>
    ); 
}

export default App;
