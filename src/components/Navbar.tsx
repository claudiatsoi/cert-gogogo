import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="border-b bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" aria-label="Go to homepage" className="shrink-0">
            <Image
              src="/c1-logo.png"
              alt="粵一創科文化協會 Logo"
              width={56}
              height={56}
              priority
              className="h-11 w-auto sm:h-12"
            />
          </Link>
          <Link href="/" className="text-primary tracking-tight leading-tight">
            <span className="block text-base sm:text-lg font-bold">粵一創科文化協會</span>
            <span className="block text-xs sm:text-sm font-semibold text-primary/80">Cant One Creative Innovation &amp; Culture Association</span>
          </Link>
        </div>
        
        <div className="flex items-center gap-4">
          <Link href="/teacher">
            <Button variant="outline" className="font-semibold">
              教師入口
            </Button>
          </Link>
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
