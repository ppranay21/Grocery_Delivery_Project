import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ArrowLeft, PackageCheck } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useProducts } from "../context/ProductContext";
import { getOptimizedImageUrl } from "../utils/images";

function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const {
    products,
    productsLoading,
    productsLoaded,
    productsError,
    fetchProducts,
  } = useProducts();
  const [quantity, setQuantity] = useState(1);

  const product = products.find((item) => item.id === Number(id));
  const isOutOfStock = product?.stock === 0;

  useEffect(() => {
    fetchProducts().catch(() => {
      // Product not found state is shown below.
    });
  }, [fetchProducts]);

  if (productsError) {
    return (
      <div className="product-details-page">
        <p className="products-error">{productsError}</p>
      </div>
    );
  }

  if (productsLoading || !productsLoaded) {
    return (
      <div className="product-details-page">
        <p className="products-message">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-details-page">
        <h1>Product not found</h1>
        <p className="details-description">
          This product may have been removed or is no longer available.
        </p>

        <Link to="/products">
          <button className="primary-btn">Back to Products</button>
        </Link>
      </div>
    );
  }

  return (
    <div className="product-details-page">
      <Link to="/products" className="back-link">
        <ArrowLeft size={20} />
        Back to Products
      </Link>

      <div className="product-details-card">
        <div className="product-details-image">
          <img
            src={getOptimizedImageUrl(product.imageUrl, 900)}
            alt={product.name}
            decoding="async"
          />
        </div>

        <div className="product-details-info">
          <p className="product-category">{product.category}</p>

          <h1>{product.name}</h1>

          <p className="details-description">{product.longDescription}</p>

          <div className="details-meta">
            <div>
              <strong>Price</strong>
              <p>${product.price.toFixed(2)}</p>
            </div>

            <div>
              <strong>Stock</strong>
              <p>{product.stock} available</p>
            </div>
          </div>

          <div className={isOutOfStock ? "stock-status unavailable" : "stock-status"}>
            <PackageCheck size={20} />
            <span>
              {isOutOfStock ? "Currently out of stock" : "Available for delivery"}
            </span>
          </div>

          {!isOutOfStock && (
            <div className="quantity-box">
              <label>Quantity</label>
              <select
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
              >
                {[1, 2, 3, 4, 5]
                  .filter((item) => item <= product.stock)
                  .map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
              </select>
            </div>
          )}

          <button
            className="details-cart-btn"
            onClick={() => addToCart(product, quantity)}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={20} />
            {isOutOfStock ? "Unavailable" : "Add to Cart"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
