import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { useAuth } from "../context/AuthContext";
import API from "../api/axios";
import { getProductImageUrl, handleProductImageError } from "../utils/images";

const emptyForm = {
  fullName: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  paymentMethod: "Cash on Delivery",
};

function Checkout() {
  const navigate = useNavigate();

  const { cartItems, cartTotal, clearCart } = useCart();
  const { fetchProducts } = useProducts();
  const { currentUser, updateCurrentUserName } = useAuth();

  const [formData, setFormData] = useState(emptyForm);
  const [saveAddress, setSaveAddress] = useState(true);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const deliveryFee = 4.99;
  const tax = cartTotal * 0.08;
  const finalTotal = cartTotal + deliveryFee + tax;

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await API.get("/profile");
        const profile = response.data;

        setFormData({
          fullName: profile.fullName || currentUser?.name || "",
          phone: profile.phone || "",
          address: profile.address || "",
          city: profile.city || "",
          state: profile.state || "",
          zipCode: profile.zipCode || "",
          paymentMethod: "Cash on Delivery",
        });
      } catch {
        toast.error("Unable to load saved delivery details");

        setFormData((previousForm) => ({
          ...previousForm,
          fullName: currentUser?.name || "",
        }));
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [currentUser]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      navigate("/products");
      return;
    }

    try {
      setPlacingOrder(true);

      const latestProducts = await fetchProducts();

      const unavailableItem = cartItems.find((cartItem) => {
        const latestProduct = latestProducts.find(
          (product) => product.id === cartItem.id
        );

        return (
          !latestProduct ||
          latestProduct.stock === 0 ||
          cartItem.quantity > latestProduct.stock
        );
      });

      if (unavailableItem) {
        toast.error(
          `Stock changed for ${unavailableItem.name}. Please review your cart.`
        );

        navigate("/cart");
        return;
      }

      if (saveAddress) {
        const profileResponse = await API.put("/profile", {
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
        });

        updateCurrentUserName(profileResponse.data.fullName);
      }

      const orderRequest = {
        ...formData,
        items: cartItems.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
        })),
      };

      await API.post("/orders", orderRequest);

      clearCart(false);
      await fetchProducts();

      toast.success("Order placed successfully");
      navigate("/my-orders");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to place order";

      toast.error(message);
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="checkout-page">
        <div className="empty-cart">
          <h1>Your cart is empty</h1>
          <p>Add products before checkout.</p>

          <Link to="/products">
            <button className="primary-btn">Shop Products</button>
          </Link>
        </div>
      </div>
    );
  }

  if (loadingProfile) {
    return (
      <div className="checkout-page">
        <p className="products-message">Loading delivery details...</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <p>Enter your delivery details to place your order.</p>
      </div>

      <div className="checkout-layout">
        <form className="checkout-form" onSubmit={handlePlaceOrder}>
          <h2>Delivery Information</h2>

          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              name="fullName"
              placeholder="Enter full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              placeholder="Enter phone number"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label>Street Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter delivery address"
              value={formData.address}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input
                type="text"
                name="city"
                placeholder="City"
                value={formData.city}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>State</label>
              <input
                type="text"
                name="state"
                placeholder="State"
                value={formData.state}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label>Zip Code</label>
            <input
              type="text"
              name="zipCode"
              placeholder="Zip code"
              value={formData.zipCode}
              onChange={handleChange}
              required
            />
          </div>

          <div className="save-address-row">
            <input
              id="saveAddress"
              type="checkbox"
              checked={saveAddress}
              onChange={(e) => setSaveAddress(e.target.checked)}
            />

            <label htmlFor="saveAddress">
              Save this address for future orders
            </label>
          </div>

          <div className="form-group">
            <label>Payment Method</label>
            <select
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleChange}
            >
              <option value="Cash on Delivery">Cash on Delivery</option>
            </select>
          </div>

          <button
            type="submit"
            className="place-order-btn"
            disabled={placingOrder}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </form>

        <div className="checkout-summary">
          <h2>Order Summary</h2>

          <div className="checkout-items">
            {cartItems.map((item) => (
              <div className="checkout-item" key={item.id}>
                <img
                  src={getProductImageUrl(item)}
                  alt={item.name}
                  onError={(event) => handleProductImageError(event, item.category)}
                />

                <div>
                  <h4>{item.name}</h4>
                  <p>
                    Qty: {item.quantity} × ${Number(item.price).toFixed(2)}
                  </p>
                </div>

                <strong>
                  ${(item.quantity * Number(item.price)).toFixed(2)}
                </strong>
              </div>
            ))}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>${cartTotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Delivery Fee</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated Tax</span>
            <span>${tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>

          <p className="checkout-note">
            Final total is confirmed by the server when your order is placed.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
