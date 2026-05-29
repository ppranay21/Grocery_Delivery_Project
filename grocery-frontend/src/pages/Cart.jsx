import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { useCart } from "../context/CartContext";
import { getProductImageUrl, handleProductImageError } from "../utils/images";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    cartTotal,
  } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="empty-cart">
          <h1>Your cart is empty</h1>
          <p>Add some groceries to continue shopping.</p>
          <Link to="/products">
            <button className="primary-btn">Shop Products</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-header">
        <h1>Shopping Cart</h1>
        <button className="clear-cart-btn" onClick={clearCart}>
          Clear Cart
        </button>
      </div>

      <div className="cart-layout">
        <div className="cart-items">
          {cartItems.map((item) => (
            <div className="cart-item" key={item.id}>
              <img
                src={getProductImageUrl(item)}
                alt={item.name}
                onError={(event) => handleProductImageError(event, item.category)}
              />

              <div className="cart-item-info">
                <h3>{item.name}</h3>
                <p>{item.category}</p>
                <strong>${Number(item.price).toFixed(2)}</strong>
                <p className="cart-stock">{item.stock} available</p>
              </div>

              <div className="cart-quantity">
                <button onClick={() => decreaseQuantity(item.id)}>
                  <Minus size={16} />
                </button>

                <span>{item.quantity}</span>

                <button onClick={() => increaseQuantity(item.id)}>
                  <Plus size={16} />
                </button>
              </div>

              <div className="cart-subtotal">
                ${(Number(item.price) * item.quantity).toFixed(2)}
              </div>

              <button
                className="remove-btn"
                onClick={() => removeFromCart(item.id)}
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>$4.99</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>${(cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>${(cartTotal + 4.99 + cartTotal * 0.08).toFixed(2)}</span>
          </div>

          <Link to="/checkout">
            <button className="checkout-btn">Proceed to Checkout</button>
          </Link>

          <Link to="/products">
            <button className="continue-btn">Continue Shopping</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Cart;
