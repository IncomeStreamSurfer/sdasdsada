"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Milk, Globe, List, Apple, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { NavigationMenu } from "@/components/ui/navigation-menu"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-primary text-primary-foreground shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold flex items-center">
            <Milk className="mr-2" />
            Cheese Guide
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-4">
            <Link href="/milk-type" className="flex items-center hover:underline">
              <Milk className="mr-1" size={18} />
              Milk Types
            </Link>
            <Link href="/origin" className="flex items-center hover:underline">
              <Globe className="mr-1" size={18} />
              Origins
            </Link>
            <Link href="/texture" className="flex items-center hover:underline">
              <List className="mr-1" size={18} />
              Textures
            </Link>
            <Link href="/flavor" className="flex items-center hover:underline">
              <Heart className="mr-1" size={18} />
              Flavors
            </Link>
            <Link href="/dietary-info" className="flex items-center hover:underline">
              <Apple className="mr-1" size={18} />
              Dietary
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 space-y-2">
            <Link
              href="/milk-type"
              className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
            >
              <Milk className="mr-2" size={18} />
              Milk Types
            </Link>
            <Link
              href="/origin"
              className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
            >
              <Globe className="mr-2" size={18} />
              Origins
            </Link>
            <Link
              href="/texture"
              className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
            >
              <List className="mr-2" size={18} />
              Textures
            </Link>
            <Link
              href="/flavor"
              className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
            >
              <Heart className="mr-2" size={18} />
              Flavors
            </Link>
            <Link
              href="/dietary-info"
              className="flex items-center p-2 hover:bg-primary-foreground/10 rounded"
            >
              <Apple className="mr-2" size={18} />
              Dietary
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
