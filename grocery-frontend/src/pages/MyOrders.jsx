import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { PackageCheck, ShoppingBag, XCircle } from "lucide-react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { useProducts } from "../context/ProductContext";
import OrderStatusTracker from "../components/OrderStatusTracker";

function MyOrders() {
  const { fetchProducts } = useProducts();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  const loadOrders = async () => {
    try {
      setErrorMessage("");

      const response = await API.get("/orders/my");
      setOrders(response.data);
    } catch (error) {
      setErrorMessage(
        error.response?.data?.message || "Unable to load orders"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setCancellingOrderId(orderId);

      const response = await API.put(`/orders/${orderId}/cancel`);

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId ? response.data : order
        )
      );

      await fetchProducts();

      toast.success("Order cancelled successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to cancel order";

      toast.error(message);
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="orders-page">
        <p className="products-message">Loading your orders...</p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="orders-page">
        <p className="products-error">{errorMessage}</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-page">
        <div className="empty-orders">
          <ShoppingBag size={54} />
          <h1>No orders yet</h1>
          <p>You have not placed any grocery orders.</p>

          <Link to="/products">
            <button className="primary-btn">Start Shopping</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your grocery delivery orders.</p>
      </div>

      <div className="orders-list">
        {orders.map((order) => (
          <div className="order-card" key={order.id}>
            <div className="order-top">
              <div>
                <h2>Order #{order.id}</h2>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <span
                className={
                  order.status === "CANCELLED"
                    ? "order-status cancelled"
                    : "order-status"
                }
              >
                {order.status === "CANCELLED" ? (
                  <XCircle size={18} />
                ) : (
                  <PackageCheck size={18} />
                )}

                {order.status.replaceAll("_", " ")}
              </span>
            </div>

            <OrderStatusTracker status={order.status} />

            <div className="order-customer">
              <h3>Delivery Details</h3>

              <p>
                <strong>Name:</strong> {order.fullName}
              </p>

              <p>
                <strong>Phone:</strong> {order.phone}
              </p>

              <p>
                <strong>Address:</strong> {order.address}, {order.city},{" "}
                {order.state} {order.zipCode}
              </p>

              <p>
                <strong>Payment:</strong> {order.paymentMethod}
              </p>
            </div>

            <div className="order-items">
              <h3>Items</h3>

              {order.items.map((item) => (
                <div className="order-item" key={item.id}>
                  <img src={item.imageUrl} alt={item.productName} />

                  <div>
                    <h4>{item.productName}</h4>

                    <p>
                      Qty: {item.quantity} × $
                      {Number(item.unitPrice).toFixed(2)}
                    </p>
                  </div>

                  <strong>${Number(item.subtotal).toFixed(2)}</strong>
                </div>
              ))}
            </div>

            <div className="order-total">
              <div>
                <span>Subtotal</span>
                <strong>${Number(order.subtotal).toFixed(2)}</strong>
              </div>

              <div>
                <span>Delivery Fee</span>
                <strong>${Number(order.deliveryFee).toFixed(2)}</strong>
              </div>

              <div>
                <span>Tax</span>
                <strong>${Number(order.tax).toFixed(2)}</strong>
              </div>

              <div className="grand-total">
                <span>Total</span>
                <strong>${Number(order.totalAmount).toFixed(2)}</strong>
              </div>
            </div>

            {order.status === "PLACED" && (
              <div className="order-actions">
                <button
                  className="cancel-order-btn"
                  onClick={() => handleCancelOrder(order.id)}
                  disabled={cancellingOrderId === order.id}
                >
                  {cancellingOrderId === order.id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyOrders;
