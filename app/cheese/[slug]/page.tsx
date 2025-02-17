import { notFound } from "next/navigation"
import fs from "fs/promises"
import path from "path"
import { CheeseCard } from "@/components/blocks/cheese-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Milk, Globe, Heart, List, Apple } from "lucide-react"

interface PageProps {
  params: {
    slug: string
  }
}

async function getCheeseData(slug: string) {
  try {
    const filePath = path.join(process.cwd(), "data/generated/cheeses", `${slug}.json`)
    const content = await fs.readFile(filePath, "utf-8")
    return JSON.parse(content)
  } catch (error) {
    return null
  }
}

async function getSimilarCheeses(cheese: any) {
  try {
    const cheesesDir = path.join(process.cwd(), "data/generated/cheeses")
    const files = await fs.readdir(cheesesDir)
    const similarCheeses = await Promise.all(
      files
        .filter(file => file.endsWith(".json") && file !== `${cheese.slug}.json`)
        .slice(0, 3)
        .map(async (file) => {
          const content = await fs.readFile(path.join(cheesesDir, file), "utf-8")
          return JSON.parse(content)
        })
    )
    return similarCheeses
  } catch (error) {
    return []
  }
}

export async function generateMetadata({ params }: PageProps) {
  const cheese = await getCheeseData(params.slug)
  
  if (!cheese) {
    return {
      title: "Cheese Not Found",
      description: "The requested cheese could not be found.",
    }
  }

  return {
    title: `${cheese.cheese} Cheese - Complete Guide and Information`,
    description: cheese.description,
    keywords: [
      cheese.cheese,
      "cheese",
      cheese.milk,
      cheese.country,
      cheese.texture,
      cheese.flavor,
      "cheese guide",
      "cheese information",
    ],
    openGraph: {
      title: `${cheese.cheese} Cheese - Complete Guide and Information`,
      description: cheese.description,
      type: "article",
    },
  }
}

export default async function CheesePage({ params }: PageProps) {
  const cheese = await getCheeseData(params.slug)

  if (!cheese) {
    notFound()
  }

  const similarCheeses = await getSimilarCheeses(cheese)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="md:col-span-2 space-y-8">
          <div>
            <h1 className="text-4xl font-bold mb-4">{cheese.cheese}</h1>
            <p className="text-lg text-muted-foreground">{cheese.description}</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Characteristics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Milk className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Milk Type</div>
                    <div className="text-sm text-muted-foreground">{cheese.milk}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Origin</div>
                    <div className="text-sm text-muted-foreground">
                      {cheese.country}
                      {cheese.region && cheese.region !== "NA" && `, ${cheese.region}`}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <List className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Texture</div>
                    <div className="text-sm text-muted-foreground">{cheese.texture}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Flavor</div>
                    <div className="text-sm text-muted-foreground">{cheese.flavor}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Apple className="h-5 w-5" />
                  <div>
                    <div className="font-medium">Dietary</div>
                    <div className="text-sm text-muted-foreground">
                      {cheese.vegetarian === "TRUE" && "Vegetarian"}
                      {cheese.vegan === "TRUE" && "Vegan"}
                      {cheese.vegetarian !== "TRUE" && cheese.vegan !== "TRUE" && "Standard"}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {cheese.history && (
            <Card>
              <CardHeader>
                <CardTitle>History</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{cheese.history}</p>
              </CardContent>
            </Card>
          )}

          {cheese.pairings && cheese.pairings.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Perfect Pairings</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {cheese.pairings.map((pairing: string, index: number) => (
                    <li key={index}>{pairing}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {cheese.serving_suggestions && cheese.serving_suggestions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Serving Suggestions</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {cheese.serving_suggestions.map((suggestion: string, index: number) => (
                    <li key={index}>{suggestion}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {cheese.nutritional_benefits && cheese.nutritional_benefits.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Nutritional Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {cheese.nutritional_benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {cheese.storage_tips && cheese.storage_tips.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Storage Tips</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="list-disc pl-5 text-muted-foreground">
                  {cheese.storage_tips.map((tip: string, index: number) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {similarCheeses.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Similar Cheeses</h2>
              <div className="space-y-4">
                {similarCheeses.map((cheese) => (
                  <CheeseCard key={cheese.slug} cheese={cheese} />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
