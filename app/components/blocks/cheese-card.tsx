import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Milk, Globe, Heart, List } from "lucide-react"

interface CheeseData {
  slug: string
  cheese: string
  milk: string
  country: string
  region: string
  texture: string
  flavor: string
  description: string
}

interface CheeseCardProps {
  cheese: CheeseData
}

export function CheeseCard({ cheese }: CheeseCardProps) {
  return (
    <Link href={`/cheese/${cheese.slug}`}>
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">{cheese.cheese}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground line-clamp-3">
              {cheese.description}
            </p>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Milk className="h-4 w-4" />
                <span>{cheese.milk}</span>
              </div>
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span>{cheese.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <List className="h-4 w-4" />
                <span>{cheese.texture}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4" />
                <span>{cheese.flavor}</span>
              </div>
            </div>

            {cheese.region && cheese.region !== "NA" && (
              <div className="text-sm text-muted-foreground">
                Region: {cheese.region}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
