"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "./utils/axios";
import { useRouter } from "next/navigation"; // Next.js 15 navigation hook
import Menu from "./component/Menu"


export default function AllPurchaseOrders() {
  const router = useRouter(); // For navigation
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    axios.get('/all_purchase.php')
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching purchase orders:", error);
      });
  }, []);

  const handleViewOrder = (orderId) => {
    router.push(`/invoice/${orderId}`);
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          <h3>All Purchase Orders</h3>
          <Menu></Menu>
          
          <hr />
        </div>
        <div className="col-md-12">
          <table className="table table-striped table-bordered">
            <thead>
              <tr>
                <th>#</th>
                <th>Order ID</th>
                <th>Supplier</th>
                <th>Total Products</th>
                <th>Total Price</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order, index) => (
                  
                  <tr key={order.id}>
                    <td>{index + 1}</td>
                    <td>{order.id}</td>
                    <td>{order.supplier.name}</td>
                    <td>{order.total_products}</td>
                    <td>{parseFloat(order.total_price).toFixed(2)}</td>
                    <td>{new Date(order.date).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn btn-info"
                        onClick={() => handleViewOrder(order.id)}
                      >
                        View Invoice
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center">
                    No purchase orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
