export function getImagePath(imageName?: string): string {
  if (!imageName) return "/default.jpeg"

  // Si es base64
  if (imageName.startsWith("data:image")) return imageName

  // Si es URL externa o placeholder
  if (imageName.startsWith("http") || imageName.startsWith("/placeholder")) return imageName

  // Si comienza con "/"
  if (imageName.startsWith("/")) return imageName

  // Si no, prepón "/"
  return `/${imageName}`
}