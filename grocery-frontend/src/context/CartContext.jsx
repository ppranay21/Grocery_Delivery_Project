import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useProducts } from "./ProductContext";

const CartContext = createContext();

export function CartProvider({ children }) {
  const { products, productsLoading, productsError } = useProducts();

  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem("cartItems");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  /*
    When backend products change:
    - update price and stock in cart
    - remove deleted products
    - remove out-of-stock products
    - reduce cart quantity if available stock becomes lower
  */
  useEffect(() => {
    if (productsLoading || productsError) {
      return;
    }

    setCartItems((currentItems) => {
      const updatedItems = currentItems
        .map((cartItem) => {
          const latestProduct = products.find(
            (product) => product.id === cartItem.id
          );

          if (!latestProduct || latestProduct.stock === 0) {
            return null;
          }

          return {
            ...latestProduct,
            quantity: Math.min(cartItem.quantity, latestProduct.stock),
          };
        })
        .filter(Boolean);

      if (JSON.stringify(updatedItems) === JSON.stringify(currentItems)) {
        return currentItems;
      }

      return updatedItems;
    });
  }, [products, productsLoading, productsError]);

  const getLatestProduct = (productId) => {
    return products.find((product) => product.id === productId);
  };

  const addToCart = (product, quantity = 1) => {
    const latestProduct = getLatestProduct(product.id) || product;
    const existingItem = cartItems.find((item) => item.id === product.id);
    const currentQuantity = existingItem ? existingItem.quantity : 0;
    const requestedQuantity = currentQuantity + quantity;

    if (latestProduct.stock === 0) {
      toast.error(`${latestProduct.name} is out of stock`);
      return;
    }

    if (requestedQuantity > latestProduct.stock) {
      toast.error(`Only ${latestProduct.stock} ${latestProduct.name} available`);
      return;
    }

    setCartItems((currentItems) => {
      const itemAlreadyInCart = currentItems.find(
        (item) => item.id === latestProduct.id
      );

      if (itemAlreadyInCart) {
        return currentItems.map((item) =>
          item.id === latestProduct.id
            ? { ...latestProduct, quantity: item.quantity + quantity }
            : item
        );
      }

      return [...currentItems, { ...latestProduct, quantity }];
    });

    toast.success(`${latestProduct.name} added to cart`);
  };

  const removeFromCart = (productId) => {
    setCartItems((currentItems) =>
      currentItems.filter((item) => item.id !== productId)
    );

    toast.success("Item removed from cart");
  };

  const increaseQuantity = (productId) => {
    const cartItem = cartItems.find((item) => item.id === productId);
    const latestProduct = getLatestProduct(productId) || cartItem;

    if (!cartItem || !latestProduct) {
      return;
    }

    if (cartItem.quantity >= latestProduct.stock) {
      toast.error(`Only ${latestProduct.stock} ${latestProduct.name} available`);
      return;
    }

    setCartItems((currentItems) =>
      currentItems.map((item) =>
        item.id === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (productId) => {
    setCartItems((currentItems) =>
      currentItems
        .map((item) =>
          item.id === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const clearCart = (showMessage = true) => {
    setCartItems([]);

    if (showMessage) {
      toast.success("Cart cleared");
    }
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + Number(item.price) * item.quantity,
    0
  );

  const cartCount = cartItems.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        cartTotal,
        cartCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
