import React, { useState } from "react";
import "../styles/AddProduct.css";
import Sidebar from "../pages/Sidebar";
import axios from "axios";

const AddProduct = () => {
  const [product, setProduct] = useState({
    name: "",
    brand: "",
    description: "",
    price: "",
    category: "",
    stockQuantity: "",
    releaseDate: "",
    productAvailable: false,
  });

  const [image, setImage] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitHandler = async (event) => {
    event.preventDefault();
    if (!image) {
      alert("Please select an image before submitting.");
      return;
    }

    const formattedProduct = {
      ...product,
      releaseDate: product.releaseDate || null,
    };

    const formData = new FormData();
    formData.append("imageFile", image);
    formData.append(
      "product",
      new Blob([JSON.stringify(formattedProduct)], {
        type: "application/json",
      })
    );

    try {
      const response = await axios.post(
        "http://localhost:8080/api/product",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      if (response.data && response.data.productId) {
        localStorage.setItem("productId", response.data.productId);
      }

      alert("Product added successfully");

      // Reset form
      setProduct({
        name: "",
        brand: "",
        description: "",
        price: "",
        category: "",
        stockQuantity: "",
        releaseDate: "",
        productAvailable: false,
      });
      setImage(null);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Error adding product");
    }
  };

  return (
    <div className="dashboard-container">
      <Sidebar />

      <main className="main-content">
        <h3 className="page-title">Add Product</h3>

        <div className="product-container">
          <form className="product-form" onSubmit={submitHandler}>
            <div className="input-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                placeholder="Product Name"
              />
            </div>

            <div className="input-group">
              <label>Brand</label>
              <input
                type="text"
                name="brand"
                value={product.brand}
                onChange={handleInputChange}
                placeholder="Brand Name"
              />
            </div>

            <div className="input-groupppp">
              <label>Description</label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                placeholder="Product Description"
              ></textarea>
            </div>

            <div className="input-group">
              <label>Price</label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                placeholder="Price"
              />
            </div>

            <div className="input-group">
              <label>Category</label>
              <select
                name="category"
                value={product.category}
                onChange={handleInputChange}
              >
                <option value="">Select category</option>
                <option value="Furniture">Furniture</option>
                <option value="Glass">Glass</option>
                <option value="Ceramic">Ceramic</option>
                <option value="Home Decor">Home Decor</option>
                <option value="Toys">Toys</option>
                <option value="Wooden Crafts">Wooden Crafts</option>
                <option value="HandWoven Baskets">HandWoven Baskets</option>
              </select>
            </div>

            <div className="input-group">
              <label>Stock Quantity</label>
              <input
                type="number"
                name="stockQuantity"
                value={product.stockQuantity}
                onChange={handleInputChange}
                placeholder="Stock Quantity"
              />
            </div>

            <div className="input-group">
              <label>Release Date</label>
              <input
                type="date"
                name="releaseDate"
                value={product.releaseDate}
                onChange={handleInputChange}
              />
            </div>

            <div className="input-group">
              <label>Image</label>
              <input type="file" onChange={handleImageChange} />
            </div>

            <div className="checkbox-group">
              <label>
                <input
                  type="checkbox"
                  name="productAvailable"
                  checked={product.productAvailable}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      productAvailable: e.target.checked,
                    })
                  }
                />
                Product Available
              </label>
            </div>

            <button type="submit" className="submit-btn">
              Add Product
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddProduct;
