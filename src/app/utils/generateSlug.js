export default function generateSlug(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-") // Replace spaces and non-word characters with hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading and trailing hyphens
}
