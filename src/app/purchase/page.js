"use client"

import { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "../utils/axios";
import { useRouter } from "next/navigation"; // Next.js 15 navigation hook
import Menu from "../component/Menu"

export default function Purchase() {
  const router = useRouter(); // Next.js navigation
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [propurchase, setPropurchase] = useState({
    supplier_id: '',
    products: [],
    total_price: 0,
  });

  useEffect(() => {
    axios.get('/products.php').then((response) => {
      setProducts(response.data);
    });
    axios.get('/suppliers.php').then((response) => {
      setSuppliers(response.data);
    });
  }, []);


  const addProduct = (product) => {
    const selectedProduct = products.find((p) => parseInt(p.id) === parseInt(product.target.value));
    setPropurchase({
      ...propurchase,
      products: [
        ...propurchase.products,
        {
          ...selectedProduct,
          quantity: 1, // Adding the quantity property
        },
      ],
      total_price: parseFloat(propurchase.total_price) + parseFloat(selectedProduct.price),
    });
  };

  const removeProduct = (productId) => {
    const updatedProducts = propurchase.products.filter((p) => p.id !== productId);
    // console.log(updatedProducts);
    setPropurchase({
      ...propurchase,
      products: updatedProducts,
      total_price: parseFloat(propurchase.total_price) - parseFloat(propurchase.products.find((p) => p.id === productId).price),
    });
  };


  const updatedProductQuantity = (e, productId) => {
    const updatedProducts = propurchase.products.map((product) =>
      product.id === productId
        ? { ...product, quantity: parseInt(e.target.value) }
        : product
    );

    // Recalculate the total price
    const updatedTotalPrice = updatedProducts.reduce(
      (total, product) => total + parseFloat(product.price) * product.quantity,
      0
    );

    setPropurchase({
      ...propurchase,
      products: updatedProducts,
      total_price: updatedTotalPrice,
    });
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Validate form inputs and submit purchase request
    if (!propurchase.supplier_id) {
        alert("Please select a supplier");
        return;
    }

    if (propurchase.products.length === 0) {
      alert("Please add products.");
      return;
  }

    try {
        const response = await axios.post("/submit_purchase.php", propurchase);
        console.log("Purchase submitted successfully:", response.data);
        alert("Order submitted successfully!");
        // Redirect to the invoice page with the purchase ID
        router.push(`/invoice/${response.data.data.id}`);
    } catch (error) {
        console.error("Error submitting order:", error);
        alert("Failed to submit order. Please try again.");
    }
};

  // console.log(products);
  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12 ">
          <h3>Create Order</h3>
          <Menu></Menu>
          <hr />
        </div>
        <div className="col-md-6 mb-4">
          <div className="form-group">
            <label>Supplier</label>
            <select className="form-control" onChange={(e) => setPropurchase({ ...propurchase, supplier_id: e.target.value })}>
              <option value="">Select Supplier</option>
              {suppliers.map((supplier) => (
                <option key={supplier.id} value={supplier.id}>{supplier.name}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="col-md-6 mb-4">
          <div className="form-group">
            <label>Products</label>
            <select className="form-control" onChange={addProduct}>
              <option value="">Select Product</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>{product.name}</option>
              ))}
            </select>
          </div>
        </div>
              <hr />
        <div className="col-md-12 my-4">
          <table className="table table-bordered">
            <thead>
              <tr className="thead">
                <th>Code</th>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Cost Price</th>
                <th>GST (18%)</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {propurchase.products.map((product) => (
                <tr key={product.id}>

                  <td>{product.id}</td>
                  <td>{product.name}</td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      defaultValue={product.quantity}
                      min={1}
                      onChange={(e) => updatedProductQuantity(e, product.id)}
                    />


                  </td>
                  <td>{product.price}</td>
                  <td>{parseFloat(((parseFloat(product.price) * 18) / 100) * parseInt(product.quantity)).toFixed(2)}</td>

                  <td>{parseFloat((parseFloat(product.price) * parseInt(product.quantity)) + ((parseFloat(product.price) * 18) / 100) * parseInt(product.quantity)).toFixed(2)}</td>


                  <td>
                    <button className="btn btn-danger" onClick={() => removeProduct(product.id)}>Remove</button>
                  </td>



                </tr>
              ))}
            </tbody>
          </table>

          <div className="row d-flex justify-content-end">
            <div className="col-md-4 ">
              <table className="table table-bordered">
                <tbody>
                  <tr>
                    <td>Sub Total</td>
                    <td>
                      {parseFloat(propurchase.products.reduce(function (total, product) {
                        return total + parseFloat(product.price) * parseInt(product.quantity);
                      }, 0)).toFixed(2)}


                    </td>
                  </tr>
                  <tr>
                    <td>GST (18%)</td>
                    <td>
                      {propurchase.products.reduce((total, item) => {
                        return total + ((parseFloat(item.price) * 18) / 100) * parseInt(item.quantity);
                      }, 0).toFixed(2)}
                    </td>
                  </tr>
                  <tr>
                    <td>Grand Total</td>
                    <td>
                      {parseFloat(
                        parseFloat(propurchase.products.reduce(function (total, product) {
                          return total + parseFloat(product.price) * parseInt(product.quantity);
                        }, 0)) +
                          propurchase.products.reduce((total, item) => {
                            return total + ((parseFloat(item.price) * 18) / 100) * parseInt(item.quantity);
                          }, 0)
                      ).toFixed(2)}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
                      
          <div className="form-group d-flex justify-content-end">
            <button className="btn btn-primary" onClick={handleSubmit}>Submit Order</button>
          </div>
        </div>

      </div>
    </div>

  );
}
