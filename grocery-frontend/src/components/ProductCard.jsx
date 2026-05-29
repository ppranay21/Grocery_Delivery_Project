import { Link } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { getProductImageUrl, handleProductImageError } from "../utils/images";

function ProductCard({ product, eager = false }) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock === 0;
  const rating = (4 + (product.id % 10) / 10).toFixed(1);
  const reviewCount = 35 + (product.id % 140);
  const unitPrice = Math.max(Number(product.price) / 2, 0.49).toFixed(2);

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
  };

  return (
    <div className="product-card" data-category={product.category}>
      <Link to={`/products/${product.id}`}>
        <img
          src={getProductImageUrl(product)}
          alt={product.name}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          fetchPriority={eager ? "high" : "auto"}
          onError={(event) => handleProductImageError(event, product.category)}
        />
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <div className="product-rating" aria-label={`${rating} out of 5 stars`}>
          <span>
            <Star size={13} fill="currentColor" />
            {rating}
          </span>
          <small>({reviewCount})</small>
        </div>

        <p className="product-unit-price">${unitPrice}/ea</p>

        <p className={isOutOfStock ? "stock out-of-stock" : "stock"}>
          {isOutOfStock ? "Out of stock" : `${product.stock} available`}
        </p>

        <div className="fulfillment-row">
          <span>Pickup</span>
          <span>Delivery</span>
        </div>

        <div className="product-bottom">
          <p className="product-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={12} />
            {isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
