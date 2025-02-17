import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import { CheeseCard } from "@/components/blocks/cheese-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { List, Globe, Milk } from "lucide-react"

interface PageProps {
  params: {
    type: string
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

async function getTextureData(type: string): Promise<CheeseData[] | null> {
  try {
    // Read the textures index
    const indexPath = path.join(process.cwd(), "data/generated/indexes/textures.json")
    const indexContent = await fs.readFile(indexPath, "utf-8")
    const textures = JSON.parse(indexContent)

    // Get the slugs for this texture
    const slugs = textures[type] || []

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

function getTextureTitle(type: string): string {
  return type
    .split("-")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export async function generateMetadata({ params }: PageProps) {
  const title = getTextureTitle(params.type)
  
  return {
    title: `${title} Cheeses - Complete Guide and Varieties`,
    description: `Discover our guide to ${title.toLowerCase()} cheeses. Learn about different varieties, characteristics, and find the perfect cheese for your taste.`,
    keywords: [
      title,
      "cheese",
      "cheese texture",
      "cheese guide",
      "cheese varieties",
      params.type,
      `${title} cheese`,
    ],
    openGraph: {
      title: `${title} Cheeses - Complete Guide and Varieties`,
      description: `Discover our guide to ${title.toLowerCase()} cheeses. Learn about different varieties, characteristics, and find the perfect cheese for your taste.`,
      type: "article",
    },
  }
}

export async function generateStaticParams() {
  try {
    const indexPath = path.join(process.cwd(), "data/generated/indexes/textures.json")
    const indexContent = await fs.readFile(indexPath, "utf-8")
    const textures = JSON.parse(indexContent)

    return Object.keys(textures).map((type) => ({
      type,
    }))
  } catch (error) {
    return []
  }
}

function calculateStatistics(cheeses: CheeseData[]) {
  const stats = {
    total: cheeses.length,
    byCountry: {} as Record<string, number>,
    byMilkType: {} as Record<string, number>,
    byFlavor: {} as Record<string, number>,
  }

  cheeses.forEach((cheese) => {
    // Count by country
    stats.byCountry[cheese.country] = (stats.byCountry[cheese.country] || 0) + 1

    // Count by milk type
    stats.byMilkType[cheese.milk] = (stats.byMilkType[cheese.milk] || 0) + 1

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

export default async function TexturePage({ params }: PageProps) {
  const cheeses = await getTextureData(params.type)

  if (!cheeses) {
    notFound()
  }

  const title = getTextureTitle(params.type)
  const stats = calculateStatistics(cheeses)

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-bold mb-4 flex items-center justify-center">
          <List className="mr-2 h-8 w-8" />
          {title} Cheeses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of {stats.total} {title.toLowerCase()} cheeses,
          featuring varieties from around the world.
        </p>
      </div>

      {/* Statistics Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Globe className="mr-2 h-4 w-4" />
              Origins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {Object.entries(stats.byCountry)
                .sort(([, a], [, b]) => b - a)
                .slice(0, 5)
                .map(([country, count]) => (
                  <li key={country} className="flex justify-between text-sm">
                    <span>{country}</span>
                    <span className="text-muted-foreground">{count} cheeses</span>
                  </li>
                ))}
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center">
              <Milk className="mr-2 h-4 w-4" />
              Milk Types
            </CardTitle>
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
            <CardTitle className="text-lg">Common Flavors</CardTitle>
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
            name: `${title} Cheeses`,
            description: `Guide to ${title.toLowerCase()} cheeses, featuring ${
              stats.total
            } varieties from around the world.`,
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
