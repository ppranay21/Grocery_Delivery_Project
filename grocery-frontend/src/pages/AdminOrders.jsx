import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../api/axios";
import { getProductImageUrl, handleProductImageError } from "../utils/images";

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      const response = await API.get("/admin/orders");
      setOrders(response.data);
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to load orders";

      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await API.put(`/admin/orders/${orderId}/status`, {
        status,
      });

      setOrders((previousOrders) =>
        previousOrders.map((order) =>
          order.id === orderId ? response.data : order
        )
      );

      toast.success("Order status updated");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to update order status";

      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="admin-page">
        <p className="products-message">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="admin-page">
        <div className="empty-orders">
          <h1>No orders found</h1>
          <p>Customer orders will appear here.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Orders</h1>
        <p>View and update customer order status.</p>
      </div>

      <div className="admin-orders-list">
        {orders.map((order) => (
          <div className="admin-order-card" key={order.id}>
            <div className="order-top">
              <div>
                <h2>Order #{order.id}</h2>
                <p>{new Date(order.createdAt).toLocaleString()}</p>
              </div>

              <select
                value={order.status}
                onChange={(e) =>
                  updateOrderStatus(order.id, e.target.value)
                }
              >
                <option value="PLACED">PLACED</option>
                <option value="PACKED">PACKED</option>
                <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
                <option value="DELIVERED">DELIVERED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
            </div>

            <div className="order-customer">
              <h3>Customer Details</h3>
              <p>
                <strong>Name:</strong> {order.fullName}
              </p>
              <p>
                <strong>Email:</strong> {order.customerEmail}
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
                  <img
                    src={getProductImageUrl(item)}
                    alt={item.productName}
                    onError={(event) => handleProductImageError(event, item.category)}
                  />

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
              <div className="grand-total">
                <span>Total</span>
                <strong>${Number(order.totalAmount).toFixed(2)}</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AdminOrders;
