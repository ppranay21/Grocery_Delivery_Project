import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import toast from "react-hot-toast";
import { useCart } from "../context/CartContext";
import { getOptimizedImageUrl } from "../utils/images";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  const isOutOfStock = product.stock === 0;

  const handleAddToCart = () => {
    if (isOutOfStock) {
      toast.error("This product is out of stock");
      return;
    }

    addToCart(product);
  };

  return (
    <div className="product-card">
      <Link to={`/products/${product.id}`}>
        <img
          src={getOptimizedImageUrl(product.imageUrl, 360)}
          alt={product.name}
          loading="lazy"
          decoding="async"
        />
      </Link>

      <div className="product-info">
        <p className="product-category">{product.category}</p>

        <Link to={`/products/${product.id}`}>
          <h3>{product.name}</h3>
        </Link>

        <p className="product-description">{product.description}</p>

        <p className={isOutOfStock ? "stock out-of-stock" : "stock"}>
          {isOutOfStock ? "Out of stock" : `${product.stock} available`}
        </p>

        <div className="product-bottom">
          <p className="product-price">
            ${Number(product.price).toFixed(2)}
          </p>

          <button
            className="add-cart-btn"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
          >
            <ShoppingCart size={14} />
            {isOutOfStock ? "Unavailable" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
