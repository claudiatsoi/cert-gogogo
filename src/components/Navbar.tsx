import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
           {/* Placeholder Logo */}
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
            G
          </div>
          <Link href="/" className="text-xl font-bold text-primary tracking-tight">
            Go-Go-Go
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
           {/* Navigation Links can go here later */}
          <Link href="/register">
            <Button variant="default" className="bg-secondary text-secondary-foreground hover:bg-secondary/90 font-semibold px-6">
              註冊 / Register
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
