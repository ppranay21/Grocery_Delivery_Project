import { createContext, useContext, useEffect, useState } from "react";
import API from "../api/axios";

const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  const fetchProducts = async () => {
    try {
      setProductsLoading(true);
      setProductsError("");

      const response = await API.get("/products");

      setProducts(response.data);

      return response.data;
    } catch (error) {
      console.error("Failed to load products:", error);

      const isNetworkError =
        error.code === "ERR_NETWORK" || error.message === "Network Error";

      if (isNetworkError) {
        setProductsError(
          "Cannot reach the backend. Start the Spring Boot API on http://localhost:8080 (see README)."
        );
      } else if (error.response?.status === 401 || error.response?.status === 403) {
        setProductsError("You do not have permission to view products.");
      } else {
        setProductsError("Unable to load products from backend.");
      }

      throw error;
    } finally {
      setProductsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts().catch(() => {
      // Error message is shown through productsError.
    });
  }, []);

  const addProduct = async (productData) => {
    const response = await API.post("/products", {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
    });

    setProducts((previousProducts) => [
      response.data,
      ...previousProducts,
    ]);

    return response.data;
  };

  const deleteProduct = async (productId) => {
    await API.delete(`/products/${productId}`);

    setProducts((previousProducts) =>
      previousProducts.filter((product) => product.id !== productId)
    );
  };

  const updateProduct = async (productId, productData) => {
    const response = await API.put(`/products/${productId}`, {
      ...productData,
      price: Number(productData.price),
      stock: Number(productData.stock),
    });

    setProducts((previousProducts) =>
      previousProducts.map((product) =>
        product.id === productId ? response.data : product
      )
    );

    return response.data;
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        productsLoading,
        productsError,
        fetchProducts,
        addProduct,
        deleteProduct,
        updateProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProducts() {
  return useContext(ProductContext);
}
