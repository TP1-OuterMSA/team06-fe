import React, { useState } from "react";
import "./MealTicketPurchase.css"; 

function MealTicketPurchase() {
  const [remainingTickets, setRemainingTickets] = useState(12);
  const totalTickets = 100;

  const handleBuyTicket = () => {
    if (remainingTickets > 0) {
      setRemainingTickets(remainingTickets - 1);
    }
  };

  return (
    <div className="container">
      {remainingTickets > 0 ? (
        <>
          <h1 className="title">{`${remainingTickets} / ${totalTickets}`}</h1>
          <button className="buyButton" onClick={handleBuyTicket}>
            식권 구매
          </button>
        </>
      ) : (
        <>
                <img className="soldOutImage" src="/soldout.png" alt="Sold Out" />
                <p className="soldOutText">식권이 모두 판매되었습니다</p>
        </>
      )}
    </div>
  );
}

export default MealTicketPurchase;
