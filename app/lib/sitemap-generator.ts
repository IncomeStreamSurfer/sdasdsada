import fs from "fs/promises"
import path from "path"

const URLS_PER_SITEMAP = 2500
const BASE_URL = "https://cheeseguide.com" // Replace with actual domain

interface CheeseData {
  slug: string
  cheese: string
  country: string
  region: string
}

async function readJsonFiles(directory: string): Promise<any[]> {
  try {
    const files = await fs.readdir(directory)
    const jsonFiles = files.filter(file => file.endsWith(".json"))
    
    const data = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(directory, file), "utf-8")
        return JSON.parse(content)
      })
    )
    
    return data
  } catch (error) {
    console.error("Error reading JSON files:", error)
    return []
  }
}

async function generateSitemapXml(urls: string[], index: number, type: string): Promise<void> {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n")}
</urlset>`

  await fs.writeFile(
    path.join(process.cwd(), "public", `sitemap-${type}-${index}.xml`),
    sitemap
  )
}

async function generateSitemapIndex(sitemaps: { filename: string; count: number }[]): Promise<void> {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${BASE_URL}/${sitemap.filename}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`

  await fs.writeFile(
    path.join(process.cwd(), "public", "sitemap.xml"),
    sitemapIndex
  )
}

async function generateRobotsTxt(sitemapCount: number): Promise<void> {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml`

  await fs.writeFile(
    path.join(process.cwd(), "public", "robots.txt"),
    robotsTxt
  )
}

export async function generateSitemaps(): Promise<void> {
  try {
    // Ensure public directory exists
    await fs.mkdir(path.join(process.cwd(), "public"), { recursive: true })

    // Read all cheese data
    const cheeses = await readJsonFiles(path.join(process.cwd(), "data/generated/cheeses"))
    
    // Read indexes
    const milkTypes = await readJsonFiles(path.join(process.cwd(), "data/generated/indexes/milk-types.json"))
    const countries = await readJsonFiles(path.join(process.cwd(), "data/generated/indexes/countries.json"))
    const textures = await readJsonFiles(path.join(process.cwd(), "data/generated/indexes/textures.json"))
    const flavors = await readJsonFiles(path.join(process.cwd(), "data/generated/indexes/flavors.json"))

    // Generate URLs for each type
    const urls = {
      cheese: cheeses.map(cheese => `${BASE_URL}/cheese/${cheese.slug}`),
      milk: Object.keys(milkTypes).map(type => `${BASE_URL}/milk-type/${type}`),
      country: Object.keys(countries).map(country => `${BASE_URL}/origin/${country}`),
      region: cheeses
        .filter(cheese => cheese.region && cheese.region !== "NA")
        .map(cheese => `${BASE_URL}/origin/${cheese.country.toLowerCase()}/${cheese.region.toLowerCase().replace(/\s+/g, "-")}`),
      texture: Object.keys(textures).map(type => `${BASE_URL}/texture/${type}`),
      flavor: Object.keys(flavors).map(type => `${BASE_URL}/flavor/${type}`),
      dietary: ["vegetarian", "vegan"].map(type => `${BASE_URL}/dietary-info/${type}`),
    }

    // Generate sitemaps for each type
    const sitemapFiles: { filename: string; count: number }[] = []

    for (const [type, typeUrls] of Object.entries(urls)) {
      const chunks = Math.ceil(typeUrls.length / URLS_PER_SITEMAP)
      
      for (let i = 0; i < chunks; i++) {
        const chunkUrls = typeUrls.slice(i * URLS_PER_SITEMAP, (i + 1) * URLS_PER_SITEMAP)
        const filename = `sitemap-${type}-${i + 1}.xml`
        
        await generateSitemapXml(chunkUrls, i + 1, type)
        sitemapFiles.push({
          filename,
          count: chunkUrls.length,
        })
      }
    }

    // Generate sitemap index
    await generateSitemapIndex(sitemapFiles)

    // Generate robots.txt
    await generateRobotsTxt(sitemapFiles.length)

    console.log("Sitemaps generated successfully!")
    console.log(`Total sitemaps: ${sitemapFiles.length}`)
    console.log("URL counts by type:")
    Object.entries(urls).forEach(([type, typeUrls]) => {
      console.log(`- ${type}: ${typeUrls.length} URLs`)
    })
  } catch (error) {
    console.error("Error generating sitemaps:", error)
    throw error
  }
}

// Add a script to run this:
// Create scripts/generate-sitemaps.ts:
// import { generateSitemaps } from "../app/lib/sitemap-generator"
// generateSitemaps().catch(console.error)
