import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";
import { getCategoryImageUrl } from "../utils/images";

function Products() {
  const {
    products,
    productsLoading,
    productsLoaded,
    productsError,
    fetchProducts,
  } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(24);
  const productsPerBatch = 24;

  useEffect(() => {
    fetchProducts().catch(() => {
      // Error message is shown through productsError.
    });
  }, [fetchProducts]);

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Beverages",
  ];
  const shoppingMethods = ["Pickup", "Delivery", "Shipping"];
  const requestedCategory = searchParams.get("category");
  const category = categories.includes(requestedCategory)
    ? requestedCategory
    : "All";

  useEffect(() => {
    setVisibleCount(productsPerBatch);
  }, [search, category]);

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    return matchesSearch && matchesCategory;
  }), [products, search, category]);
  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMoreProducts = visibleCount < filteredProducts.length;

  const handleCategoryChange = (nextCategory) => {
    if (nextCategory === "All") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: nextCategory });
  };

  if (productsError) {
    return (
      <div className="products-page">
        <p className="products-error">{productsError}</p>
        <button
          type="button"
          className="retry-btn"
          onClick={() => fetchProducts().catch(() => {})}
        >
          Retry
        </button>
      </div>
    );
  }

  if (productsLoading || !productsLoaded) {
    return (
      <div className="products-page">
        <p className="products-message">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="products-header">
        <div>
          <p className="products-kicker">FreshCart grocery</p>
          <h1>Groceries</h1>
          <p>Shop fresh food, pantry staples, and daily essentials.</p>
        </div>

        <div className="club-fulfillment">
          {shoppingMethods.map((method) => (
            <button key={method} type="button">
              {method}
            </button>
          ))}
        </div>
      </div>

      <div className="category-strip" aria-label="Shop by category">
        {categories.filter((item) => item !== "All").map((item) => (
          <button
            key={item}
            type="button"
            className={category === item ? "active" : ""}
            onClick={() => handleCategoryChange(item)}
          >
            <img src={getCategoryImageUrl(item)} alt="" />
            <span>{item}</span>
          </button>
        ))}
      </div>

      <div className="club-products-layout">
        <aside className="products-sidebar">
          <div className="sidebar-title">
            <SlidersHorizontal size={18} />
            Filters
          </div>

          <button
            type="button"
            className={category === "All" ? "sidebar-filter active" : "sidebar-filter"}
            onClick={() => handleCategoryChange("All")}
          >
            All grocery
          </button>

          {categories.filter((item) => item !== "All").map((item) => (
            <button
              key={item}
              type="button"
              className={category === item ? "sidebar-filter active" : "sidebar-filter"}
              onClick={() => handleCategoryChange(item)}
            >
              {item}
            </button>
          ))}
        </aside>

        <section className="products-results">
          <div className="products-toolbar">
            <div className="products-search">
              <Search size={18} />
              <input
                type="text"
                placeholder="Search within groceries"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="products-count">
              Showing {visibleProducts.length} of {filteredProducts.length}
            </div>
          </div>

          <div className="products-grid">
            {filteredProducts.length > 0 ? (
              visibleProducts.map((product, index) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  eager={index < 8}
                />
              ))
            ) : (
              <p className="no-products">No products found.</p>
            )}
          </div>

          {hasMoreProducts && (
            <div className="load-more-wrap">
              <button
                type="button"
                className="load-more-btn"
                onClick={() => setVisibleCount((count) => count + productsPerBatch)}
              >
                Load More
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Products;
