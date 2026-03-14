import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary text-primary-foreground py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold mb-4 text-secondary">Go-Go-Go</h3>
            <p className="text-primary-foreground/80 max-w-xs">
              激發香港學生的學術卓越與競爭精神。<br/>
              Fueling academic excellence and competitive spirit in Hong Kong students.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4 text-accent">連結 / Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="hover:text-accent transition-colors">
                  使用條款 (Terms of Use)
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-accent transition-colors">
                  私隱政策 (Privacy Policy)
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-accent transition-colors">
                  免責聲明 (Disclaimer)
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-accent">聯絡我們 / Contact</h4>
            <p className="text-primary-foreground/80">電郵 / Support: help@claunode.com</p>
          </div>
        </div>
        
        <div className="border-t border-primary-foreground/20 pt-8 text-center text-sm text-primary-foreground/60">
          &copy; {currentYear} Go-Go-Go Competition Platform. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
