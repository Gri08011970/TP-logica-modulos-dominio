const API_URL = import.meta.env.VITE_API_URL ?? "/api";

/**
 * Recibe lo que está guardado en Mongo en el campo `image`
 * y devuelve una URL que el navegador pueda cargar.
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return "";

  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  let path = imagePath;
  if (!path.startsWith("/")) path = `/${path}`;
  if (!path.startsWith("/images/")) {
    path = `/images${path}`;
  }

  return `${API_URL}${path}`;
}


