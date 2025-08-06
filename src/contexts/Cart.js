import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from './CartContext';
import { FaTrash } from 'react-icons/fa';

function Cart() {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);

  // Calculate the total price
  const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  if (cart.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h2>Your Cart is Empty</h2>
        <p>Looks like you haven't added anything to your cart yet.</p>
        <Link to="/collection" className="btn btn-primary">Continue Shopping</Link>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Your Shopping Cart</h2>
        <button className="btn btn-danger" onClick={clearCart}>
          Clear Cart
        </button>
      </div>
      
      <ul className="list-group mb-4">
        {cart.map(item => (
          <li key={item.id} className="list-group-item d-flex justify-content-between align-items-center">
            <div className="d-flex align-items-center">
              <img src={item.image} alt={item.name} style={{ width: '80px', height: '80px', objectFit: 'cover', marginRight: '15px' }} />
              <div>
                <h5 className="mb-1">{item.name}</h5>
                <p className="mb-1">{item.price.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}</p>
                 <small>Quantity: {item.quantity}</small>
              </div>
            </div>
            <button className="btn btn-outline-danger btn-sm" onClick={() => removeFromCart(item.id)}>
              <FaTrash />
            </button>
          </li>
        ))}
      </ul>

      <div className="card">
        <div className="card-body text-end">
            <h4 className="card-title">
                Total: {totalPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' })}
            </h4>
            <p className="card-text">Shipping and taxes calculated at checkout.</p>
            <button className="btn btn-success">Proceed to Checkout</button>
        </div>
      </div>
    </div>
  );
}

export default Cart;