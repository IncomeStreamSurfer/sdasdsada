import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import Link from "next/link"
import { CheeseCard } from "@/components/blocks/cheese-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Globe, Map } from "lucide-react"

interface PageProps {
  params: {
    country: string
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

async function getCountryData(country: string): Promise<CheeseData[] | null> {
  try {
    // Read the countries index
    const indexPath = path.join(process.cwd(), "data/generated/indexes/countries.json")
    const indexContent = await fs.readFile(indexPath, "utf-8")
    const countries = JSON.parse(indexContent)

    // Get the slugs for this country
    const slugs = countries[country] || []

    // Read each cheese file
    const cheeses = await Promise.all(
      slugs.map(async (slug: string) => {
        const cheesePath = path.join(process.cwd(), "data/generated/cheeses", `${slug}.json`)
        const cheeseContent = await fs.readFile(cheesePath, "utf-8")
        return JSON.parse(cheeseContent) as CheeseData
      })
    )

    return cheeses
  } catch (error) {
    return null
  }
}

function getCountryTitle(country: string): string {
  return country
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }: PageProps) {
  const title = getCountryTitle(params.country)
  
  return {
    title: `${title} Cheeses - Traditional and Popular Varieties`,
    description: `Explore the rich tradition of ${title} cheeses. Discover regional specialties, traditional varieties, and learn about their unique characteristics.`,
    keywords: [
      title,
      "cheese",
      "cheese origin",
      "traditional cheese",
      `${title} cheese`,
      "cheese varieties",
      params.country,
    ],
    openGraph: {
      title: `${title} Cheeses - Traditional and Popular Varieties`,
      description: `Explore the rich tradition of ${title} cheeses. Discover regional specialties, traditional varieties, and learn about their unique characteristics.`,
      type: "article",
    },
  }
}

export async function generateStaticParams() {
  try {
    const indexPath = path.join(process.cwd(), "data/generated/indexes/countries.json")
    const indexContent = await fs.readFile(indexPath, "utf-8")
    const countries = JSON.parse(indexContent)

    return Object.keys(countries).map((country) => ({
      country,
    }))
  } catch (error) {
    return []
  }
}

function calculateStatistics(cheeses: CheeseData[]) {
  const stats = {
    total: cheeses.length,
    byRegion: {} as Record<string, number>,
    byMilkType: {} as Record<string, number>,
    byTexture: {} as Record<string, number>,
  }

  cheeses.forEach((cheese) => {
    // Count by region
    if (cheese.region && cheese.region !== "NA") {
      stats.byRegion[cheese.region] = (stats.byRegion[cheese.region] || 0) + 1
    }

    // Count by milk type
    stats.byMilkType[cheese.milk] = (stats.byMilkType[cheese.milk] || 0) + 1

    // Count by texture
    const textures = cheese.texture.split(",").map((t: string) => t.trim())
    textures.forEach((texture: string) => {
      stats.byTexture[texture] = (stats.byTexture[texture] || 0) + 1
    })
  })

  return stats
}

export default async function CountryPage({ params }: PageProps) {
  const cheeses = await getCountryData(params.country)

  if (!cheeses) {
    notFound()
  }

  const title = getCountryTitle(params.country)
  const stats = calculateStatistics(cheeses)

  // Group cheeses by region with proper typing
  const cheesesByRegion = cheeses.reduce<Record<string, CheeseData[]>>((acc, cheese) => {
    if (cheese.region && cheese.region !== "NA") {
      acc[cheese.region] = acc[cheese.region] || []
      acc[cheese.region].push(cheese)
    }
    return acc
  }, {})

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <Globe className="mr-2 h-8 w-8" />
          {title} Cheeses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore the rich tradition of {title} cheesemaking, featuring {stats.total} unique
          varieties from {Object.keys(cheesesByRegion).length} different regions.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Regions</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(stats.byRegion)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([region, count]) => (
                  <li key={region} className="flex justify-between text-sm">
                    <Link
                      href={`/origin/${params.country}/${region.toLowerCase().replace(/\s+/g, "-")}`}
                      className="hover:underline"
                    >
                      {region}
                    </Link>
                    <span className="text-muted-foreground">{count} cheeses</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

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
      </div>

      {/* Regional Sections */}
      {Object.entries(cheesesByRegion).map(([region, regionalCheeses]) => (
        <section key={region} className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold flex items-center">
              <Map className="mr-2 h-6 w-6" />
              {region} Region
            </h2>
            <Link
              href={`/origin/${params.country}/${region.toLowerCase().replace(/\s+/g, "-")}`}
              className="text-primary hover:underline"
            >
              View all {regionalCheeses.length} cheeses
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {regionalCheeses.slice(0, 3).map((cheese: CheeseData) => (
              <CheeseCard key={cheese.slug} cheese={cheese} />
            ))}
          </div>
        </section>
      ))}

      {/* Other Cheeses */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Other {title} Cheeses</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cheeses
            .filter((cheese) => !cheese.region || cheese.region === "NA")
            .map((cheese) => (
              <CheeseCard key={cheese.slug} cheese={cheese} />
            ))}
        </div>
      </section>

      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `${title} Cheeses`,
            description: `Comprehensive guide to ${title} cheeses, featuring ${
              stats.total
            } varieties from ${Object.keys(cheesesByRegion).length} regions.`,
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
