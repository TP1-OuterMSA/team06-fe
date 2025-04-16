import React from "react"; 
import MealTicketPurchase from "./components/MealTicketPurchase";
import MealCongestionGraph from "./components/MealCongestionGraph";
import { BrowserRouter, Routes, Route, Link} from "react-router-dom";


function App() { 
    return ( 
        <BrowserRouter>
            <Routes>
                <Route path="/ticket" element={<MealTicketPurchase/>}/>
                <Route path="/congestion" element={<MealCongestionGraph />} />
            </Routes>
        </BrowserRouter>
    ); 
}

export default App;