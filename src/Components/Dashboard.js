import React from 'react';
import { Link } from 'react-router-dom';

// CSS for the 100vh layout
const styles = `
  .hero-container {
    min-height: 96vh;
    width: 100%;
    background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2070&auto=format&fit=crop') no-repeat center center;
    background-size: cover;
    display: flex;
    flex-direction: column;
    justify-content: space-between; /* Pushes content and footer apart */
    color: white;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
    padding: 3rem 2rem;
  }

  .main-content {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-grow: 1; /* Allows this section to take up available space */
  }
  
  .product-showcase-item {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(5px);
    border-radius: 0.5rem;
    padding: 1rem;
    display: flex;
    align-items: center;
    transition: background 0.3s ease;
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .product-showcase-item:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  
  .product-showcase-item img {
    width: 80px;
    height: 80px;
    border-radius: 0.25rem;
    object-fit: cover;
    margin-right: 1rem;
  }
  
  .value-props {
    flex-shrink: 0; /* Prevents this section from shrinking */
  }
`;

function Dashboard() {
  // Sample data
  const featuredProducts = [
    { id: 1, name: 'Smart Fitness Watch', price: '₹4,499', image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964&auto=format&fit=crop' },
    { id: 2, name: 'Wireless Headphones', price: '₹8,999', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop' },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="hero-container">
        
        {/* Main content: Promo text on left, products on right */}
        <main className="main-content">
          <div className="container-fluid">
            <div className="row align-items-center">
              
              {/* Left Side: Promotional Text */}
              <div className="col-lg-6 text-center text-lg-start mb-5 mb-lg-0">
                <h1 className="display-3 fw-bold">Style Meets Speed</h1>
                <p className="lead my-4">
                  Discover exclusive deals on the latest trends. Everything you need, delivered to your doorstep.
                </p>
                <Link to="/collection" className="btn btn-primary btn-lg px-5">Explore Collection</Link>
              </div>

              {/* Right Side: Product Showcase */}
              <div className="col-lg-6">
                <div className="d-grid gap-3">
                  <h4 className="text-center fw-light">Today's Picks</h4>
                  {featuredProducts.map(product => (
                    <Link to={`/product/${product.id}`} className="text-decoration-none text-white" key={product.id}>
                      <div className="product-showcase-item">
                        <img src={product.image} alt={product.name} />
                        <div className="flex-grow-1">
                          <h5 className="mb-1">{product.name}</h5>
                          <p className="mb-0 fw-bold">{product.price}</p>
                        </div>
                        <i className="bi bi-arrow-right-circle fs-3"></i>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Bottom Section: Value Propositions */}
        <footer className="value-props">
          <div className="container-fluid">
            <div className="row text-center">
              <div className="col-md-4">
                <h5><i className="bi bi-truck me-2"></i>Fast Shipping</h5>
              </div>
              <div className="col-md-4">
                <h5><i className="bi bi-shield-check me-2"></i>Secure Payments</h5>
              </div>
              <div className="col-md-4">
                <h5><i className="bi bi-headset me-2"></i>24/7 Support</h5>
              </div>
            </div>
          </div>
        </footer>
        
      </div>
    </>
  );
}

export default Dashboard;