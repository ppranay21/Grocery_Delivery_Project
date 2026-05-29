import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Trash2, PlusCircle, Pencil, X, Save } from "lucide-react";
import { useProducts } from "../context/ProductContext";

const emptyForm = {
  name: "",
  category: "",
  price: "",
  stock: "",
  imageUrl: "",
  description: "",
  longDescription: "",
};

function AdminProducts() {
  const {
    products,
    productsLoading,
    productsLoaded,
    productsError,
    fetchProducts,
    addProduct,
    deleteProduct,
    updateProduct,
  } = useProducts();

  const [formData, setFormData] = useState(emptyForm);
  const [editingProductId, setEditingProductId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});

  const isEditing = editingProductId !== null;

  useEffect(() => {
    fetchProducts().catch(() => {
      // Existing error handling covers failed product loading.
    });
  }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previousForm) => ({
      ...previousForm,
      [name]: value,
    }));

    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      [name]: "",
    }));
  };

  const startEdit = (product) => {
    setEditingProductId(product.id);
    setFieldErrors({});

    setFormData({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      imageUrl: product.imageUrl,
      description: product.description,
      longDescription: product.longDescription || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const cancelEdit = () => {
    setEditingProductId(null);
    setFormData(emptyForm);
    setFieldErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);
      setFieldErrors({});

      if (isEditing) {
        await updateProduct(editingProductId, formData);
        toast.success("Product updated successfully");
      } else {
        await addProduct(formData);
        toast.success("Product added successfully");
      }

      setFormData(emptyForm);
      setEditingProductId(null);
    } catch (error) {
      const backendErrors = error.response?.data?.errors || {};
      const message =
        error.response?.data?.message || "Unable to save product";

      setFieldErrors(backendErrors);

      if (error.response?.status === 403) {
        toast.error("Only admins can manage products");
      } else if (error.response?.status === 401) {
        toast.error("Please login again");
      } else {
        toast.error(message);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(productId);

      if (editingProductId === productId) {
        cancelEdit();
      }

      toast.success("Product deleted successfully");
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to delete product";

      toast.error(message);
    }
  };

  if (productsError) {
    return (
      <div className="admin-page">
        <p className="products-error">{productsError}</p>
      </div>
    );
  }

  if (productsLoading || !productsLoaded) {
    return (
      <div className="admin-page">
        <p className="products-message">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>Manage Products</h1>
        <p>Add, update, and delete grocery products.</p>
      </div>

      <div className="admin-products-layout">
        <form className="admin-product-form" onSubmit={handleSubmit}>
          <div className="admin-form-title">
            <h2>{isEditing ? "Edit Product" : "Add Product"}</h2>

            {isEditing && (
              <button
                type="button"
                className="cancel-edit-btn"
                onClick={cancelEdit}
              >
                <X size={16} />
                Cancel
              </button>
            )}
          </div>

          <div className="form-group">
            <label>Product Name</label>
            <input
              type="text"
              name="name"
              placeholder="Example: Mango"
              value={formData.name}
              onChange={handleChange}
            />
            {fieldErrors.name && (
              <p className="field-error">{fieldErrors.name}</p>
            )}
          </div>

          <div className="form-group">
            <label>Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select Category</option>
              <option value="Fruits">Fruits</option>
              <option value="Vegetables">Vegetables</option>
              <option value="Dairy">Dairy</option>
              <option value="Bakery">Bakery</option>
              <option value="Meat">Meat</option>
              <option value="Beverages">Beverages</option>
            </select>
            {fieldErrors.category && (
              <p className="field-error">{fieldErrors.category}</p>
            )}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Price</label>
              <input
                type="number"
                step="0.01"
                min="0"
                name="price"
                placeholder="2.99"
                value={formData.price}
                onChange={handleChange}
              />
              {fieldErrors.price && (
                <p className="field-error">{fieldErrors.price}</p>
              )}
            </div>

            <div className="form-group">
              <label>Stock</label>
              <input
                type="number"
                min="0"
                name="stock"
                placeholder="100"
                value={formData.stock}
                onChange={handleChange}
              />
              {fieldErrors.stock && (
                <p className="field-error">{fieldErrors.stock}</p>
              )}
            </div>
          </div>

          <div className="form-group">
            <label>Image URL</label>
            <input
              type="url"
              name="imageUrl"
              placeholder="https://image-url.com/product.jpg"
              value={formData.imageUrl}
              onChange={handleChange}
            />
            {fieldErrors.imageUrl && (
              <p className="field-error">{fieldErrors.imageUrl}</p>
            )}
          </div>

          <div className="form-group">
            <label>Short Description</label>
            <input
              type="text"
              name="description"
              placeholder="Fresh grocery product"
              value={formData.description}
              onChange={handleChange}
            />
            {fieldErrors.description && (
              <p className="field-error">{fieldErrors.description}</p>
            )}
          </div>

          <div className="form-group">
            <label>Long Description</label>
            <textarea
              name="longDescription"
              placeholder="Detailed product description"
              value={formData.longDescription}
              onChange={handleChange}
            ></textarea>
            {fieldErrors.longDescription && (
              <p className="field-error">{fieldErrors.longDescription}</p>
            )}
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={saving}
          >
            {isEditing ? <Save size={18} /> : <PlusCircle size={18} />}

            {saving
              ? "Saving..."
              : isEditing
                ? "Update Product"
                : "Add Product"}
          </button>
        </form>

        <div className="admin-product-list">
          <h2>Product List</h2>

          {products.length === 0 ? (
            <p>No products available.</p>
          ) : (
            products.map((product) => (
              <div className="admin-product-item" key={product.id}>
                <img src={product.imageUrl} alt={product.name} />

                <div className="admin-product-details">
                  <h3>{product.name}</h3>
                  <p>{product.category}</p>
                  <strong>${Number(product.price).toFixed(2)}</strong>
                  <p>Stock: {product.stock}</p>
                </div>

                <div className="admin-product-buttons">
                  <button
                    className="admin-edit-btn"
                    onClick={() => startEdit(product)}
                    aria-label={`Edit ${product.name}`}
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    className="admin-delete-btn"
                    onClick={() => handleDeleteProduct(product.id)}
                    aria-label={`Delete ${product.name}`}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminProducts;
