import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Milk, Globe, List, Heart, Apple } from "lucide-react"

export default function Home() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Discover the World of Fine Cheeses
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Explore our comprehensive guide to artisanal cheeses from around the
          world. Learn about origins, flavors, and perfect pairings.
        </p>
      </section>

      {/* Category Navigation */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-8">Browse By Category</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          <Link href="/milk-type">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Milk className="mr-2 h-5 w-5" />
                  Milk Types
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Explore cheeses by their milk source - cow, goat, sheep, and more.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/origin">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Globe className="mr-2 h-5 w-5" />
                  Origins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Discover cheeses from different countries and regions.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/texture">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <List className="mr-2 h-5 w-5" />
                  Textures
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find cheeses by texture - from soft and creamy to hard and crumbly.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/flavor">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Heart className="mr-2 h-5 w-5" />
                  Flavors
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Browse cheeses by flavor profile - mild, sharp, sweet, and more.
                </p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/dietary-info">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center text-lg">
                  <Apple className="mr-2 h-5 w-5" />
                  Dietary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Find vegetarian and vegan cheese options.
                </p>
              </CardContent>
            </Card>
          </Link>
        </div>
      </section>

      {/* Featured Sections */}
      <section className="grid md:grid-cols-2 gap-8 mb-16">
        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Origins</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/origin/france"
              className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-semibold mb-2">French Cheeses</h3>
              <p className="text-sm text-muted-foreground">
                Discover classic French cheeses and their rich traditions.
              </p>
            </Link>
            <Link
              href="/origin/italy"
              className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-semibold mb-2">Italian Cheeses</h3>
              <p className="text-sm text-muted-foreground">
                Explore Italy's diverse cheese-making heritage.
              </p>
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Types</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/texture/soft"
              className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-semibold mb-2">Soft Cheeses</h3>
              <p className="text-sm text-muted-foreground">
                From creamy Brie to fresh Mozzarella.
              </p>
            </Link>
            <Link
              href="/texture/hard"
              className="p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
            >
              <h3 className="font-semibold mb-2">Hard Cheeses</h3>
              <p className="text-sm text-muted-foreground">
                Aged classics like Parmesan and Cheddar.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="bg-muted p-8 rounded-lg">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-4">Why Choose Our Cheese Guide?</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-semibold mb-2">Comprehensive</h3>
              <p className="text-sm text-muted-foreground">
                Detailed information about hundreds of cheese varieties.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Expert Knowledge</h3>
              <p className="text-sm text-muted-foreground">
                Curated content from cheese experts and connoisseurs.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">Easy Navigation</h3>
              <p className="text-sm text-muted-foreground">
                Find exactly what you're looking for with our intuitive categories.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
