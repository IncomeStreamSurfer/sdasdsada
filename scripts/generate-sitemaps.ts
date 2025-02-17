import { generateSitemaps } from "../app/lib/sitemap-generator"

console.log("Starting sitemap generation...")

generateSitemaps()
  .then(() => {
    console.log("Sitemap generation completed successfully!")
    process.exit(0)
  })
  .catch((error) => {
    console.error("Error generating sitemaps:", error)
    process.exit(1)
  })
