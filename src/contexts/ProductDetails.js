import React, { useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { mockProducts } from './mockData';
import { CartContext } from './CartContext';
import { FaShoppingCart } from 'react-icons/fa'; // Optional: for a nice icon

function ProductDetail() {
  const { id } = useParams();
  const product = mockProducts.find(p => p.id === parseInt(id));

  // 1. Get both cart and addToCart from the context
  const { cart, addToCart } = useContext(CartContext);

  // 2. Check if the product is already in the cart
  const isInCart = cart.some(item => item.id === product?.id);

  if (!product) {
    return (
      <div className="container text-center mt-5">
        <h2>Product Not Found</h2>
        <p>The product you are looking for does not exist.</p>
        <Link to="/collection" className="btn btn-primary">Back to Collection</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="row g-0">
          <div className="col-md-4 d-flex justify-content-center align-items-center p-4">
            <img src={product.image} className="img-fluid rounded-start" alt={product.name} style={{ maxHeight: '300px' }} />
          </div>
          <div className="col-md-8">
            <div className="card-body">
              <h3 className="card-title">{product.name}</h3>
              <div className="d-flex align-items-center mb-2">
                <span className="badge bg-success me-2">{product.rating} ★</span>
                <span className="text-muted">({product.reviews.toLocaleString('en-IN')} Ratings & Reviews)</span>
              </div>
              <h4 className="text-success fw-bold">
                {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
              </h4>
              <p className="card-text">
                <small className="text-muted text-decoration-line-through">
                  {product.originalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
                </small>
              </p>
              <p className="card-text">{product.description || "No description available for this product."}</p>
              
              {/* 3. Conditionally render the button */}
              {isInCart ? (
                <Link to="/cart" className="btn btn-info me-2">
                  <FaShoppingCart className="me-1" /> Go to Cart
                </Link>
              ) : (
                <button 
                  className="btn btn-primary me-2" 
                  onClick={() => addToCart(product)}
                >
                  Add to Cart
                </button>
              )}
              
              <button className="btn btn-success">Buy Now</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;