import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import "./index.css";

const existingUsers = JSON.parse(localStorage.getItem("users")) || [];

const demoUserExists = existingUsers.find(
  (user) => user.email === "user@gmail.com"
);

const adminUserExists = existingUsers.find(
  (user) => user.email === "admin@gmail.com"
);

let updatedUsers = [...existingUsers];

if (!demoUserExists) {
  updatedUsers.push({
    id: 1,
    name: "Demo User",
    email: "user@gmail.com",
    password: "123456",
    role: "USER",
  });
}

if (!adminUserExists) {
  updatedUsers.push({
    id: 2,
    name: "Admin User",
    email: "admin@gmail.com",
    password: "admin123",
    role: "ADMIN",
  });
}

localStorage.setItem("users", JSON.stringify(updatedUsers));

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <CartProvider>
            <App />
            <Toaster position="top-right" />
          </CartProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
