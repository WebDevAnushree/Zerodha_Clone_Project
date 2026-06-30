
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const Orders = () => {
  const [allOrders, setAllOrders] = useState([]);

  useEffect(() => {
    axios
      .get("https://zerodha-clone-project-backend-5q2e.onrender.com/allOrders")
      .then((res) => setAllOrders(res.data))
      .catch((err) => console.error("Failed to fetch orders:", err));
  }, []);

  if (allOrders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">Get started</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h3 className="title">Orders ({allOrders.length})</h3>
      <div className="order-table">
        <table>
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{order.price.toFixed(2)}</td>
                <td>
                  <span style={{
                    color: order.mode === "BUY" ? "#2196f3" : "#f44336",
                    fontWeight: "bold",
                    padding: "2px 8px",
                    borderRadius: "4px",
                    backgroundColor: order.mode === "BUY"
                      ? "rgba(33,150,243,0.1)"
                      : "rgba(244,67,54,0.1)",
                  }}>
                    {order.mode}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;