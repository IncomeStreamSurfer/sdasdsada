import Link from "next/link"
import { Milk, Globe, List, Heart, Apple } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Browse By</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/milk-type"
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <Milk className="mr-2 h-4 w-4" />
                  Milk Types
                </Link>
              </li>
              <li>
                <Link
                  href="/origin"
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <Globe className="mr-2 h-4 w-4" />
                  Origins
                </Link>
              </li>
              <li>
                <Link
                  href="/texture"
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <List className="mr-2 h-4 w-4" />
                  Textures
                </Link>
              </li>
              <li>
                <Link
                  href="/flavor"
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <Heart className="mr-2 h-4 w-4" />
                  Flavors
                </Link>
              </li>
              <li>
                <Link
                  href="/dietary-info"
                  className="text-muted-foreground hover:text-primary flex items-center"
                >
                  <Apple className="mr-2 h-4 w-4" />
                  Dietary Options
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/milk-type/cow"
                  className="text-muted-foreground hover:text-primary"
                >
                  Cow Milk Cheeses
                </Link>
              </li>
              <li>
                <Link
                  href="/origin/france"
                  className="text-muted-foreground hover:text-primary"
                >
                  French Cheeses
                </Link>
              </li>
              <li>
                <Link
                  href="/texture/soft"
                  className="text-muted-foreground hover:text-primary"
                >
                  Soft Cheeses
                </Link>
              </li>
              <li>
                <Link
                  href="/flavor/mild"
                  className="text-muted-foreground hover:text-primary"
                >
                  Mild Cheeses
                </Link>
              </li>
              <li>
                <Link
                  href="/dietary-info/vegetarian"
                  className="text-muted-foreground hover:text-primary"
                >
                  Vegetarian Cheeses
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">About Cheese Guide</h3>
            <p className="text-muted-foreground text-sm">
              Your comprehensive guide to the world of cheese. Discover varieties,
              origins, and perfect pairings for every cheese lover.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Cheese Guide. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
