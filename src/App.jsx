import React from "react"; 
import MealTicketPurchase from "./components/MealTicketPurchase";
import MealCongestionGraph from "./components/MealCongestionGraph";
import Login from "./components/Login";
import Register from "./components/Register";
import Mypage from "./components/mypage/Mypage"

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
            </Routes>
        </BrowserRouter>
    ); 
}

export default App;
