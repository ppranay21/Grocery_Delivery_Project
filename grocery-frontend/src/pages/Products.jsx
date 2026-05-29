import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { useProducts } from "../context/ProductContext";

function Products() {
  const { products, productsLoading, productsError, fetchProducts } =
    useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(72);
  const productsPerBatch = 72;

  const categories = [
    "All",
    "Fruits",
    "Vegetables",
    "Dairy",
    "Bakery",
    "Meat",
    "Beverages",
  ];
  const requestedCategory = searchParams.get("category");
  const category = categories.includes(requestedCategory)
    ? requestedCategory
    : "All";

  useEffect(() => {
    setVisibleCount(productsPerBatch);
  }, [search, category]);

  const handleCategoryChange = (nextCategory) => {
    if (nextCategory === "All") {
      setSearchParams({});
      return;
    }

    setSearchParams({ category: nextCategory });
  };

  if (productsLoading) {
    return (
      <div className="products-page">
        <p className="products-message">Loading products...</p>
      </div>
    );
  }

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

  return (
    <div className="products-page">
      <div className="products-header">
        <h1>Shop Groceries</h1>
        <p>Find fresh groceries and daily essentials.</p>
      </div>

      <div className="products-filter">
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={category}
          onChange={(e) => handleCategoryChange(e.target.value)}
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>

      <p className="products-count">
        Showing {visibleProducts.length} of {filteredProducts.length} items
      </p>

      <div className="products-grid">
        {filteredProducts.length > 0 ? (
          visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
    </div>
  );
}

export default Products;
