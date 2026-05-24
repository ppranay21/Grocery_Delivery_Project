export function getOptimizedImageUrl(imageUrl, width = 360) {
  if (!imageUrl || imageUrl.startsWith("/")) {
    return imageUrl;
  }

  if (!imageUrl.includes("images.unsplash.com")) {
    return imageUrl;
  }

  const separator = imageUrl.includes("?") ? "&" : "?";
  return `${imageUrl}${separator}auto=format&fit=crop&w=${width}&q=65`;
}
