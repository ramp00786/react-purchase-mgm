"use client";

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../../utils/axios";
import { useRouter } from "next/navigation"; // Next.js 15 navigation hook
import { use } from "react";
import Menu from "../../component/Menu"

export default function Invoice({ params }) {
  const { id } = use(params);
  const [invoice, setInvoice] = useState(null);
  useEffect(() => {
    
    axios
      .get(`/invoice.php?id=${id}`) // Fetch purchase details
      .then((response) => setInvoice(response.data))
      .catch((error) => console.error("Error fetching invoice:", error));
  }, [id]);

  console.log(invoice);
  if (!invoice) return <p className="text-center">Loading...</p>;

  return (
    <div className="container mt-4">
      <h3>Invoice</h3>
      <Menu></Menu>
      <hr />
      <div className="row mb-4">
        <div className="col-md-6">
          <h5>Supplier Details</h5>
          <p>
            <strong>Name:</strong> {invoice.supplier.name} <br />
            <strong>Address:</strong> {invoice.supplier.address} <br />
            <strong>Contact:</strong> {invoice.supplier.contact}
          </p>
        </div>
        <div className="col-md-6 text-end">
          <h5>Invoice Details</h5>
          <p>
            <strong>Invoice ID:</strong> {invoice.id} <br />
            <strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()} <br />
            <strong>Total:</strong> ₹{parseFloat(invoice.total_price).toFixed(2)}
          </p>
        </div>
      </div>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Code</th>
            <th>Product Name</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {invoice.products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.quantity}</td>
              <td>₹{parseFloat(product.price).toFixed(2)}</td>
              <td>
                ₹
                {parseFloat(product.price * product.quantity).toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="row d-flex justify-content-end mt-4">
        <div className="col-md-4">
          <table className="table table-bordered">
            <tbody>
              <tr>
                <td>Sub Total</td>
                <td>₹{invoice.sub_total.toFixed(2)}</td>
              </tr>
              <tr>
                <td>GST (18%)</td>
                <td>₹{invoice.gst.toFixed(2)}</td>
              </tr>
              <tr>
                <td>Grand Total</td>
                <td>₹{parseFloat(invoice.total_price).toFixed(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
