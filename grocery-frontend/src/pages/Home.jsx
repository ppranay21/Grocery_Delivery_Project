import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Search, Truck, ShieldCheck, Clock } from "lucide-react";
import ProductCard from "../components/ProductCard";
import API from "../api/axios";
import { getCategoryImageUrl } from "../utils/images";
import heroImage from "../assets/hero-groceries.png";

function Home() {
  const [products, setProducts] = useState([]);
  const [popularStart, setPopularStart] = useState(0);
  const visiblePopularCount = 4;

  useEffect(() => {
    API.get("/products?limit=12")
      .then((response) => setProducts(response.data))
      .catch((error) => {
        console.error("Failed to load featured products:", error);
      });
  }, []);

  const popularProducts = useMemo(() => {
    if (products.length <= visiblePopularCount) {
      return products;
    }

    return Array.from({ length: visiblePopularCount }, (_, offset) => {
      return products[(popularStart + offset) % products.length];
    });
  }, [products, popularStart]);

  const showPreviousProducts = () => {
    if (products.length === 0) {
      return;
    }

    setPopularStart((current) =>
      (current - visiblePopularCount + products.length) % products.length
    );
  };

  const showNextProducts = () => {
    if (products.length === 0) {
      return;
    }

    setPopularStart((current) =>
      (current + visiblePopularCount) % products.length
    );
  };

  const categories = [
    {
      name: "Fruits",
      image: getCategoryImageUrl("Fruits"),
      accent: "#f97316",
      position: "center",
    },
    {
      name: "Vegetables",
      image: getCategoryImageUrl("Vegetables"),
      accent: "#16a34a",
      position: "center",
    },
    {
      name: "Dairy",
      image: getCategoryImageUrl("Dairy"),
      accent: "#2563eb",
      position: "center",
    },
    {
      name: "Bakery",
      image: getCategoryImageUrl("Bakery"),
      accent: "#b45309",
      position: "center",
    },
    {
      name: "Meat",
      image: getCategoryImageUrl("Meat"),
      accent: "#dc2626",
      position: "center",
    },
    {
      name: "Beverages",
      image: getCategoryImageUrl("Beverages"),
      accent: "#0891b2",
      position: "center",
    },
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
            src={heroImage}
            alt="Fresh groceries"
          />
        </div>
      </section>

      <section className="categories-section">
        <h2>Shop by Category</h2>

        <div className="category-grid">
          {categories.map((category) => (
            <Link
              key={category.name}
              to={`/products?category=${encodeURIComponent(category.name)}`}
              className="category-card"
              style={{
                "--category-accent": category.accent,
                "--category-position": category.position,
              }}
            >
              <img src={category.image} alt={category.name} loading="lazy" />
              <span>{category.name}</span>
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
        <div className="section-title-row">
          <h2>Popular Products</h2>

          <div className="product-slider-controls">
            <button
              type="button"
              onClick={showPreviousProducts}
              aria-label="Previous products"
              disabled={products.length <= visiblePopularCount}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              type="button"
              onClick={showNextProducts}
              aria-label="Next products"
              disabled={products.length <= visiblePopularCount}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        <div className="popular-grid">
          {popularProducts.map((product, index) => (
            <ProductCard
              key={product.id}
              product={product}
              eager={index < 4}
            />
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
