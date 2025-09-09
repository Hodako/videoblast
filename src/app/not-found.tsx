// src/app/not-found.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Header from '@/components/header'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex flex-col items-center justify-center text-center pt-20">
        <Frown className="w-24 h-24 text-primary mb-4" />
        <h1 className="text-4xl font-bold mb-2">404 - Page Not Found</h1>
        <p className="text-muted-foreground mb-6 max-w-md">
          Oops! The page you are looking for does not exist. It might have been moved or deleted.
        </p>
        <Button asChild size="lg">
            <Link href="/">Go Back to Homepage</Link>
        </Button>
      </main>
    </div>
  )
}
