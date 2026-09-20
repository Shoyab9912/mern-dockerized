import React, { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");

      if (!res.ok) {
        throw new Error("Failed to fetch products");
      }

      const data = await res.json();
      setProducts(data);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add product");
      }

      setForm({
        name: "",
        category: "",
        price: "",
        description: "",
      });

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete product");
      }

      await fetchProducts();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <main className="app">
      <div className="container">
        <header className="header">
          <div>
            <h1>Product Manager</h1>
            <p>Add and manage your products</p>
          </div>

          <span className="product-count">
            {products.length} {products.length === 1 ? "Product" : "Products"}
          </span>
        </header>

        <section className="form-card">
          <h2>Add Product</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">Product Name</label>
                <input
                  id="name"
                  name="name"
                  placeholder="e.g. MacBook Pro"
                  value={form.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <input
                  id="category"
                  name="category"
                  placeholder="e.g. Electronics"
                  value={form.category}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="price">Price</label>
                <input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="e.g. 999"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Description</label>
                <input
                  id="description"
                  name="description"
                  placeholder="Short description"
                  value={form.description}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button className="add-button" type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add Product"}
            </button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="products-section">
          <div className="section-header">
            <h2>Products</h2>
          </div>

          {products.length === 0 ? (
            <div className="empty-state">
              <h3>No products yet</h3>
              <p>Add your first product using the form above.</p>
            </div>
          ) : (
            <div className="product-grid">
              {products.map((product) => (
                <article className="product-card" key={product._id}>
                  <div className="product-info">
                    <div className="product-top">
                      <h3>{product.name}</h3>
                      <span className="price">${product.price}</span>
                    </div>

                    <span className="category">{product.category}</span>

                    {product.description && (
                      <p className="description">{product.description}</p>
                    )}
                  </div>

                  <button
                    className="delete-button"
                    onClick={() => handleDelete(product._id)}
                  >
                    Delete
                  </button>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}