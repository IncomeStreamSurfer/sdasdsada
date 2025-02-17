import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import loadEnv from './load-env.mjs';

// Load environment variables
loadEnv();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const URLS_PER_SITEMAP = 2500;
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://cheeseguide.com";

async function readJsonFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return null;
  }
}

async function readCheeseFiles() {
  try {
    const cheesesDir = path.join(process.cwd(), "data/generated/cheeses");
    const files = await fs.readdir(cheesesDir);
    const jsonFiles = files.filter(file => file.endsWith(".json"));
    
    const cheeses = await Promise.all(
      jsonFiles.map(async (file) => {
        const content = await fs.readFile(path.join(cheesesDir, file), "utf-8");
        return JSON.parse(content);
      })
    );
    
    return cheeses;
  } catch (error) {
    console.error("Error reading cheese files:", error);
    return [];
  }
}

async function generateSitemapXml(urls, index, type) {
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join("\n")}
</urlset>`;

  await fs.writeFile(
    path.join(process.cwd(), "public", `sitemap-${type}-${index}.xml`),
    sitemap
  );
}

async function generateSitemapIndex(sitemaps) {
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(sitemap => `  <sitemap>
    <loc>${BASE_URL}/${sitemap.filename}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`).join("\n")}
</sitemapindex>`;

  await fs.writeFile(
    path.join(process.cwd(), "public", "sitemap.xml"),
    sitemapIndex
  );
}

async function generateRobotsTxt(sitemapCount) {
  const robotsTxt = `# https://www.robotstxt.org/robotstxt.html
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${BASE_URL}/sitemap.xml`;

  await fs.writeFile(
    path.join(process.cwd(), "public", "robots.txt"),
    robotsTxt
  );
}

async function main() {
  try {
    console.log('Starting sitemap generation...');
    console.log(`Using base URL: ${BASE_URL}`);

    // Ensure public directory exists
    await fs.mkdir(path.join(process.cwd(), "public"), { recursive: true });

    // Read all cheese data
    const cheeses = await readCheeseFiles();
    
    // Read indexes
    const indexesPath = path.join(process.cwd(), "data/generated/indexes");
    const milkTypes = await readJsonFile(path.join(indexesPath, "milk-types.json")) || {};
    const countries = await readJsonFile(path.join(indexesPath, "countries.json")) || {};
    const textures = await readJsonFile(path.join(indexesPath, "textures.json")) || {};
    const flavors = await readJsonFile(path.join(indexesPath, "flavors.json")) || {};
    const dietary = await readJsonFile(path.join(indexesPath, "dietary.json")) || {};

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
      dietary: Object.keys(dietary).map(type => `${BASE_URL}/dietary-info/${type}`),
    };

    // Generate sitemaps for each type
    const sitemapFiles = [];

    for (const [type, typeUrls] of Object.entries(urls)) {
      if (typeUrls.length === 0) continue;

      const chunks = Math.ceil(typeUrls.length / URLS_PER_SITEMAP);
      
      for (let i = 0; i < chunks; i++) {
        const chunkUrls = typeUrls.slice(i * URLS_PER_SITEMAP, (i + 1) * URLS_PER_SITEMAP);
        const filename = `sitemap-${type}-${i + 1}.xml`;
        
        await generateSitemapXml(chunkUrls, i + 1, type);
        sitemapFiles.push({
          filename,
          count: chunkUrls.length,
        });
      }
    }

    // Generate sitemap index
    await generateSitemapIndex(sitemapFiles);

    // Generate robots.txt
    await generateRobotsTxt(sitemapFiles.length);

    console.log("Sitemaps generated successfully!");
    console.log(`Total sitemaps: ${sitemapFiles.length}`);
    console.log("URL counts by type:");
    Object.entries(urls).forEach(([type, typeUrls]) => {
      console.log(`- ${type}: ${typeUrls.length} URLs`);
    });
  } catch (error) {
    console.error("Error generating sitemaps:", error);
    throw error;
  }
}

main().catch(console.error);
