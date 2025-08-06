import React from 'react';
import { Link } from 'react-router-dom';
import { mockProducts } from './contexts/mockData'; // Import the data

// A small, self-contained component for the Product Card
function ProductCard({ product }) {
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);

  return (
    <div className="col">
      <div className="card h-100 border-0 product-card">
        {/* The Link now correctly points to the protected route */}
        <Link to={`/product/${product.id}`} className="text-decoration-none text-dark">
          <div className="product-image-container">
            <img src={product.image} className="card-img-top" alt={product.name} />
          </div>
          <div className="card-body p-2">
            <h6 className="card-title product-title">{product.name}</h6>
            <div className="d-flex align-items-center mb-1">
              <span className="badge bg-success me-2 d-flex align-items-center">
                {product.rating} <i className="bi bi-star-fill" style={{ fontSize: '0.6em', marginLeft: '3px' }}></i>
              </span>
              <span className="text-muted product-reviews">({product.reviews.toLocaleString('en-IN')})</span>
              {product.assured && (
                <img 
                  src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/fa_62673a.png" 
                  alt="Assured" 
                  className="product-assured-logo ms-2"
                />
              )}
            </div>
            <div className="d-flex align-items-baseline">
              <h5 className="product-price mb-0">
                {product.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
              </h5>
              <span className="text-muted text-decoration-line-through mx-2">
                {product.originalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })}
              </span>
              <span className="text-success fw-bold">{discount}% off</span>
            </div>
            <p className="text-muted small mb-0">Free delivery</p>
          </div>
        </Link>
      </div>
    </div>
  );
}

function Collection() {
  const styles = `
    body { background-color: #f1f3f6; }
    .product-card { transition: box-shadow 0.2s ease-in-out; }
    .product-card:hover { box-shadow: 0 4px 15px rgba(0,0,0,0.1); }
    .product-title {
      font-size: 0.9rem;
      font-weight: 500;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .product-image-container {
      height: 130px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .product-image-container img { max-height: 100%; max-width: 50%; object-fit: contain; }
    .product-reviews { font-size: 0.8rem; }
    .product-assured-logo { width: 70px; }
    .product-price { font-size: 1.1rem; }
  `;

  return (
    <>
      <style>{styles}</style>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card shadow-sm">
              <div className="card-body">
                <h5 className="mb-3 text-center">All Collections</h5>
                <div className="row row-cols-1 row-cols-sm-2 row-cols-lg-3 row-cols-xl-4 g-3">
                  {mockProducts.map(product => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Collection;