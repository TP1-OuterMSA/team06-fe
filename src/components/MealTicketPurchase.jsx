import React, { useState } from "react";
import { useEffect } from "react";
import Axios from "axios";
import "../styles/MealTicketPurchase.css";

function MealTicketPurchase() {
  const [remainingTickets, setRemainingTickets] = useState(null);

  useEffect(() => {
    getRemainingTickets();
  }, []);

  const getRemainingTickets = async () => {
    try {
      const response = await Axios.get("http://localhost:8080/api/team6/ticket");
      const data = response.data;
      setRemainingTickets(data);
    } catch (error) {
      console.error("Error fetching tickets:", error);
    }
  }

  const handleTicketPurchase = async () => {
    try {
      const response = await Axios.post(`http://localhost:8080/api/team6/ticket/${remainingTickets.id}/purchase`);
      const data = response.data;
      setRemainingTickets(data.ticket);
    } catch (error) {
      console.error("Error purchasing ticket:", error);
    }
  }

  return (
    <div className="container">
      {remainingTickets && !remainingTickets.soldOut ? (
        <>
          <h1 className="menu-title">{remainingTickets.menu}</h1>
          <h2 className="title">{`${remainingTickets.count} / ${remainingTickets.totalCount}`}</h2>
          <button className="buyButton" onClick={() => handleTicketPurchase()}>
            식권 구매
          </button>
        </>
      ) : (
        <>
          <img className="soldOutImage" src="/soldout.png" alt="Sold Out" />
          <p className="soldOutText">식권이 모두 판매되었습니다!</p>
        </>
      )}
    </div>
  );
}

export default MealTicketPurchase;