// src/services/imageUrl.js

// La URL base del backend (la misma que ya usás para la API)
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4001/api";

// Me quedo solo con el "origen": http://localhost:4001
const BACKEND_ORIGIN = new URL(API_URL).origin;

export function getImageUrl(imagePath) {
  if (!imagePath) return "";

  // Si ya es una URL absoluta, la devuelvo tal cual
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // Me aseguro de que empiece con "/"
  const normalized = imagePath.startsWith("/") ? imagePath : `/${imagePath}`;

  // Ejemplo: "http://localhost:4001" + "/images/mujer/bermudas/bermudas-02.webp"
  return `${BACKEND_ORIGIN}${normalized}`;
}
