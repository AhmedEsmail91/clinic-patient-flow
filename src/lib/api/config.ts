export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export const IMAGE_ROUTE = `${API_BASE_URL}${process.env.NEXT_PUBLIC_IMAGE_ROUTE || ""}/`;
