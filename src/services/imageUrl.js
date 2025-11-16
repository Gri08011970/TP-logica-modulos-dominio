const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001";

/**
 * Recibe lo que está guardado en Mongo en el campo `image`
 * y devuelve una URL que el navegador pueda cargar.
 *
 * Ejemplos esperados en la BD:
 *  - "/images/mujer/vestidos/vestido-06.webp"
 *  - "/images/hombre/jeans/jeans-01.webp"
 */
export function getImageUrl(imagePath) {
  if (!imagePath) return "";

  // Si ya viene con http/https, la dejamos como está
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Nos aseguramos de que empiece con /images/...
  let path = imagePath;
  if (!path.startsWith("/")) path = `/${path}`;

  // Si alguien guardó solo "mujer/vestidos/vestido-06.webp"
  if (!path.startsWith("/images/")) {
    path = `/images${path}`;
  }

  return `${API_URL}${path}`;
}

