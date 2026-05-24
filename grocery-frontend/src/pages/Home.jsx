import { Link } from "react-router-dom";
import { Search, Truck, ShieldCheck, Clock } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

function Home() {
  const { products } = useProducts();
  const categories = [
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Beverages",
  ];

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <p className="hero-subtitle">Fresh groceries delivered fast</p>

          <h1>Get your groceries delivered to your door</h1>

          <p className="hero-description">
            Shop fruits, vegetables, dairy, bakery items, and daily essentials
            from the comfort of your home.
          </p>

          <div className="hero-search">
            <Search size={22} />
            <input type="text" placeholder="Search for groceries..." />
            <Link to="/products">
              <button>Search</button>
            </Link>
          </div>

          <div className="hero-buttons">
            <Link to="/products">
              <button className="primary-btn">Shop Now</button>
            </Link>

            <Link to="/register">
              <button className="secondary-btn">Create Account</button>
            </Link>
          </div>
        </div>

        <div className="hero-image">
          <img
            src="https://images.unsplash.com/photo-1542838132-92c53300491e"
            alt="Fresh groceries"
          />
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category}
              to={`/products?category=${encodeURIComponent(category)}`}
              className="category-card"
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="features-section">
        <div className="feature-card">
          <Truck size={36} />
          <h3>Fast Delivery</h3>
          <p>Get groceries delivered quickly to your home.</p>
        </div>

        <div className="feature-card">
          <ShieldCheck size={36} />
          <h3>Fresh Products</h3>
          <p>We provide fresh and quality grocery items.</p>
        </div>

        <div className="feature-card">
          <Clock size={36} />
          <h3>Easy Ordering</h3>
          <p>Order anytime using our simple online platform.</p>
        </div>
      </section>

      <section className="popular-section">
        <h2>Popular Products</h2>

        <div className="popular-grid">
          {products.slice(0, 4).map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="view-all">
          <Link to="/products">
            <button className="primary-btn">View All Products</button>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;
