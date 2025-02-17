import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Home, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-500" />
          <CardTitle className="text-3xl">Page Not Found</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            Sorry, we couldn't find the page you're looking for. It might have been
            moved, deleted, or never existed.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/milk-type">
                <Search className="w-4 h-4" />
                Browse Cheeses
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Link
                href="/milk-type/cow"
                className="text-sm hover:underline text-primary"
              >
                Cow Milk Cheeses
              </Link>
              <Link
                href="/origin/france"
                className="text-sm hover:underline text-primary"
              >
                French Cheeses
              </Link>
              <Link
                href="/texture/soft"
                className="text-sm hover:underline text-primary"
              >
                Soft Cheeses
              </Link>
              <Link
                href="/flavor/mild"
                className="text-sm hover:underline text-primary"
              >
                Mild Cheeses
              </Link>
              <Link
                href="/dietary-info/vegetarian"
                className="text-sm hover:underline text-primary"
              >
                Vegetarian Cheeses
              </Link>
              <Link
                href="/origin/italy"
                className="text-sm hover:underline text-primary"
              >
                Italian Cheeses
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
