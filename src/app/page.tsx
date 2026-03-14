import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20 px-4 sm:px-6 lg:px-8 flex-grow flex flex-col items-center justify-center text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4 tracking-tight text-secondary">
          成就孩子未來 
        </h1>
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6 text-primary-foreground/90">
          Empower Your Child’s Future
        </h2>
        <p className="text-lg sm:text-xl mb-8 max-w-2xl mx-auto text-primary-foreground/80 leading-relaxed">
          香港首選學術比賽平台。挑戰自我，贏取認可，持續成長。<br/>
          The premier academic competition platform for Hong Kong students. 
          Challenge yourself, earn recognition, and grow.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/register">
            <Button size="lg" className="text-lg px-8 py-6 bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold shadow-lg transform transition hover:scale-105">
              參加比賽 / Join Competition
            </Button>
          </Link>
          <Link href="/learn-more">
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-secondary text-secondary hover:bg-secondary/10 font-bold">
              了解更多 / Learn More
            </Button>
          </Link>
        </div>
      </section>

      {/* Features / About Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">為什麼選擇 Go-Go-Go? / Why Go-Go-Go?</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              我們為全港學生提供一個公平、有趣及有獎勵的學習平台。<br/>
              We provide a fair, engaging, and rewarding platform for students across Hong Kong.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="text-5xl mb-6">🏆</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">贏取認可 <br/><span className="text-base text-muted-foreground">Earn Recognition</span></h3>
              <p className="text-muted-foreground text-sm">
                獲得官方證書和獎牌，豐富你的學術檔案。<br/>
                Get official certificates and medals to boost your academic portfolio.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="text-5xl mb-6">🧠</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">挑戰技能 <br/><span className="text-base text-muted-foreground">Challenge Skills</span></h3>
              <p className="text-muted-foreground text-sm">
                透過我們全面的題庫，與同儕比拼中英數常識。<br/>
                Test your knowledge against peers in English, Math, and Science.
              </p>
            </div>
            
            <div className="p-8 bg-white rounded-xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="text-5xl mb-6">🚀</div>
              <h3 className="text-xl font-semibold mb-2 text-primary">成長思維 <br/><span className="text-base text-muted-foreground">Growth Mindset</span></h3>
              <p className="text-muted-foreground text-sm">
                詳細的表現分析和回饋，幫助學生識別強項和改進空間。<br/>
                Detailed performance analysis help students identify areas for improvement.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
