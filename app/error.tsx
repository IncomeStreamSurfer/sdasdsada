"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertOctagon, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Runtime error:", error)
  }, [error])

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[calc(100vh-4rem)]">
      <Card className="max-w-2xl w-full">
        <CardHeader className="text-center">
          <AlertOctagon className="w-16 h-16 mx-auto mb-4 text-destructive" />
          <CardTitle className="text-3xl">Something Went Wrong</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-lg text-muted-foreground">
            We apologize, but something went wrong while processing your request.
            Our team has been notified of the issue.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => reset()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Try Again
            </Button>
            <Button asChild variant="outline" className="flex items-center gap-2">
              <Link href="/">
                <Home className="w-4 h-4" />
                Return Home
              </Link>
            </Button>
          </div>

          <div className="pt-6 border-t">
            <h3 className="font-semibold mb-4">You might want to try:</h3>
            <ul className="text-sm text-muted-foreground space-y-2">
              <li>• Refreshing the page</li>
              <li>• Checking your internet connection</li>
              <li>• Coming back in a few minutes</li>
            </ul>
          </div>

          {process.env.NODE_ENV === "development" && (
            <div className="pt-6 border-t">
              <h3 className="font-semibold mb-2">Error Details:</h3>
              <pre className="text-sm bg-muted p-4 rounded-md overflow-auto text-left">
                {error.message}
                {"\n"}
                {error.stack}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
