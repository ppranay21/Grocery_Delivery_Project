const categoryImages = {
  Fruits: "/category-fruits-photo.jpg",
  Vegetables: "/category-vegetables-photo.jpg",
  Dairy: "/category-dairy-photo.jpg",
  Bakery: "/category-bakery-photo.jpg",
  Meat: "/category-meat-photo.jpg",
  Beverages: "/category-beverages-photo.jpg",
};

function getOptimizedRemoteImageUrl(imageUrl, width = 360) {
  if (!imageUrl || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  if (!imageUrl.includes("images.unsplash.com")) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}auto=format&fit=crop&w=${width}&q=60`;
}

export function getCategoryImageUrl(category) {
  return categoryImages[category] || "/tomatoes.svg";
}

export function getProductImageUrl(product, width = 360) {
  if (!product?.imageUrl) {
    return getCategoryImageUrl(product?.category);
  }

  return getOptimizedRemoteImageUrl(product.imageUrl, width);
}

export function handleProductImageError(event, category) {
  event.currentTarget.onerror = null;
  event.currentTarget.src = getCategoryImageUrl(category);
}
