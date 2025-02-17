import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import Link from "next/link"
import { CheeseCard } from "@/components/blocks/cheese-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Map, ArrowLeft } from "lucide-react"

interface PageProps {
  params: {
    country: string
    region: string
  }
}

interface CheeseData {
  slug: string
  cheese: string
  milk: string
  country: string
  region: string
  type: string
  texture: string
  flavor: string
  aroma: string
  vegetarian: string
  vegan: string
  description: string
  history: string
  pairings: string[]
  serving_suggestions: string[]
  nutritional_benefits: string[]
  cultural_significance: string[]
  storage_tips: string[]
  [key: string]: any
}

async function getRegionData(country: string, region: string): Promise<CheeseData[] | null> {
  try {
    // Read the regions index
    const indexPath = path.join(process.cwd(), "data/generated/indexes/regions.json")
    const indexContent = await fs.readFile(indexPath, "utf-8")
    const regions = JSON.parse(indexContent)

    // Get the slugs for this region
    const regionSlug = region.toLowerCase()
    const slugs = regions[regionSlug] || []

    // Read each cheese file and filter by country
    const cheeses = await Promise.all(
      slugs.map(async (slug: string) => {
        const cheesePath = path.join(process.cwd(), "data/generated/cheeses", `${slug}.json`)
        const cheeseContent = await fs.readFile(cheesePath, "utf-8")
        return JSON.parse(cheeseContent) as CheeseData
      })
    )

    // Filter cheeses to match both country and region
    return cheeses.filter(
      (cheese) =>
        cheese.country.toLowerCase() === country &&
        cheese.region.toLowerCase().replace(/\s+/g, "-") === region
    )
  } catch (error) {
    return null
  }
}

function getTitle(str: string): string {
  return str
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }: PageProps) {
  const countryTitle = getTitle(params.country)
  const regionTitle = getTitle(params.region)
  
  return {
    title: `${regionTitle} Cheeses from ${countryTitle} - Regional Guide`,
    description: `Discover traditional ${regionTitle} cheeses from ${countryTitle}. Learn about local specialties, characteristics, and the rich cheesemaking heritage of this region.`,
    keywords: [
      regionTitle,
      countryTitle,
      "cheese",
      "regional cheese",
      "traditional cheese",
      `${regionTitle} cheese`,
      "cheese varieties",
      params.region,
      params.country,
    ],
    openGraph: {
      title: `${regionTitle} Cheeses from ${countryTitle} - Regional Guide`,
      description: `Discover traditional ${regionTitle} cheeses from ${countryTitle}. Learn about local specialties, characteristics, and the rich cheesemaking heritage of this region.`,
      type: "article",
    },
  }
}

export async function generateStaticParams() {
  try {
    // Read both country and region indexes to generate all possible combinations
    const countriesPath = path.join(process.cwd(), "data/generated/indexes/countries.json")
    const regionsPath = path.join(process.cwd(), "data/generated/indexes/regions.json")
    
    const countriesContent = await fs.readFile(countriesPath, "utf-8")
    const regionsContent = await fs.readFile(regionsPath, "utf-8")
    
    const countries = JSON.parse(countriesContent)
    const regions = JSON.parse(regionsContent)

    const params: { country: string; region: string }[] = []

    // For each region, check which countries have cheeses from that region
    for (const region of Object.keys(regions)) {
      const regionCheeses = regions[region]
      const uniqueCountries = new Set<string>()

      for (const slug of regionCheeses) {
        const cheesePath = path.join(process.cwd(), "data/generated/cheeses", `${slug}.json`)
        const cheeseContent = await fs.readFile(cheesePath, "utf-8")
        const cheese = JSON.parse(cheeseContent) as CheeseData
        uniqueCountries.add(cheese.country.toLowerCase())
      }

      for (const country of uniqueCountries) {
        params.push({
          country,
          region,
        })
      }
    }

    return params
  } catch (error) {
    return []
  }
}

function calculateStatistics(cheeses: CheeseData[]) {
  const stats = {
    total: cheeses.length,
    byMilkType: {} as Record<string, number>,
    byTexture: {} as Record<string, number>,
    byFlavor: {} as Record<string, number>,
  }

  cheeses.forEach((cheese) => {
    // Count by milk type
    stats.byMilkType[cheese.milk] = (stats.byMilkType[cheese.milk] || 0) + 1

    // Count by texture
    const textures = cheese.texture.split(",").map((t: string) => t.trim())
    textures.forEach((texture: string) => {
      stats.byTexture[texture] = (stats.byTexture[texture] || 0) + 1
    })

    // Count by flavor
    if (cheese.flavor) {
      const flavors = cheese.flavor.split(",").map((f: string) => f.trim())
      flavors.forEach((flavor: string) => {
        stats.byFlavor[flavor] = (stats.byFlavor[flavor] || 0) + 1
      })
    }
  })

  return stats
}

export default async function RegionPage({ params }: PageProps) {
  const cheeses = await getRegionData(params.country, params.region)

  if (!cheeses || cheeses.length === 0) {
    notFound()
  }

  const countryTitle = getTitle(params.country)
  const regionTitle = getTitle(params.region)
  const stats = calculateStatistics(cheeses)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="mb-8">
        <Link
          href={`/origin/${params.country}`}
          className="text-primary hover:underline inline-flex items-center"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to {countryTitle} Cheeses
        </Link>
      </div>

      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Map className="mr-2 h-8 w-8" />
          {regionTitle} Cheeses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover {stats.total} traditional cheeses from the {regionTitle} region
          of {countryTitle}.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Milk Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(stats.byMilkType)
                .sort(([, a], [, b]) => b - a)
                .map(([milk, count]) => (
                  <li key={milk} className="flex justify-between text-sm">
                    <span>{milk}</span>
                    <span className="text-muted-foreground">{count} cheeses</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Textures</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(stats.byTexture)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([texture, count]) => (
                  <li key={texture} className="flex justify-between text-sm">
                    <span>{texture}</span>
                    <span className="text-muted-foreground">{count} cheeses</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Flavors</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(stats.byFlavor)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([flavor, count]) => (
                  <li key={flavor} className="flex justify-between text-sm">
                    <span>{flavor}</span>
                    <span className="text-muted-foreground">{count} cheeses</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {/* Cheese Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {cheeses.map((cheese) => (
          <CheeseCard key={cheese.slug} cheese={cheese} />
        ))}
      </div>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${regionTitle} Cheeses from ${countryTitle}`,
            description: `Traditional cheeses from the ${regionTitle} region of ${countryTitle}, featuring ${stats.total} varieties.`,
            numberOfItems: stats.total,
            itemListElement: cheeses.map((cheese, index) => ({
              "@type": "ListItem",
              position: index + 1,
              item: {
                "@type": "Product",
                name: cheese.cheese,
                description: cheese.description,
                category: "Cheese",
              },
            })),
          }),
        }}
      />
    </div>
  )
}
