import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, ShoppingBag, DollarSign } from "lucide-react";
import { useProducts } from "../context/ProductContext";
import API from "../api/axios";

function AdminDashboard() {
  const { products } = useProducts();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    API.get("/admin/orders")
      .then((response) => setOrders(response.data))
      .catch((error) => console.error("Unable to load admin orders", error));
  }, []);

  const totalRevenue = orders.reduce(
    (total, order) => total + Number(order.totalAmount),
    0
  );

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <p>Manage grocery products and customer orders.</p>
      </div>

      <div className="admin-stats-grid dashboard-three-cards">
        <div className="admin-stat-card">
          <Package size={36} />

          <div>
            <h3>{products.length}</h3>
            <p>Total Products</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <ShoppingBag size={36} />

          <div>
            <h3>{orders.length}</h3>
            <p>Total Orders</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <DollarSign size={36} />

          <div>
            <h3>${totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="admin-actions">
        <Link to="/admin/products">
          <button>Manage Products</button>
        </Link>

        <Link to="/admin/orders">
          <button>Manage Orders</button>
        </Link>
      </div>
    </div>
  );
}

export default AdminDashboard;
