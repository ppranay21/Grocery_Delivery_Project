import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const { currentUser, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        <img src="/freshcart-logo.svg" alt="" />
        FreshCart
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>

        {currentUser && (
          <>
            <Link to="/my-orders">My Orders</Link>
            <Link to="/profile">Profile</Link>
          </>
        )}

        {currentUser?.role === "ADMIN" && <Link to="/admin">Admin</Link>}

        {currentUser ? (
          <>
            <span className="user-name">Hi, {currentUser.name}</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}

        <Link to="/cart" className="cart-link">
          <ShoppingCart size={20} />
          Cart
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
