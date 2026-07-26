import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FIRST_COMPETITION } from "@/lib/competition";

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

      <section className="py-16 px-4 bg-gradient-to-b from-background via-muted/20 to-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] items-stretch">
            <div className="rounded-3xl border border-border bg-slate-950 text-white p-8 sm:p-10 shadow-2xl overflow-hidden relative">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.12),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(252,211,77,0.18),_transparent_30%)]" />
              <div className="relative space-y-6">
                <div className="inline-flex items-center rounded-full border border-white/20 bg-white/10 px-4 py-1 text-sm font-semibold tracking-wide">
                  首場比賽通知 / First Competition Notice
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-secondary/90 mb-3">{FIRST_COMPETITION.title}</p>
                  <h2 className="text-3xl sm:text-4xl font-bold leading-tight">
                    幼稚園專屬比賽已準備就緒，敬請留意報名與比賽日期。
                  </h2>
                </div>
                <p className="text-white/80 text-base sm:text-lg leading-relaxed max-w-2xl">
                  The first competition poster is now featured on the website. Applications open from {FIRST_COMPETITION.applicationStartLabel}, and the competition period runs from {FIRST_COMPETITION.competitionStartLabel} to {FIRST_COMPETITION.competitionEndLabel}.
                </p>
                <div className="flex flex-wrap gap-3 text-sm font-semibold">
                  <span className="rounded-full bg-white/10 px-4 py-2">報名開始 / Application: {FIRST_COMPETITION.applicationStartLabel}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2">比賽開始 / Start: {FIRST_COMPETITION.competitionStartLabel}</span>
                  <span className="rounded-full bg-white/10 px-4 py-2">比賽結束 / End: {FIRST_COMPETITION.competitionEndLabel}</span>
                </div>
                <div className="grid gap-3 sm:grid-cols-3 pt-2 text-sm text-white/80">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white mb-1">只限幼稚園學生</p>
                    <p>Only kindergarten students can join after login.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white mb-1">登入後驗證</p>
                    <p>Eligibility is checked after student login.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="font-semibold text-white mb-1">適合首場推廣</p>
                    <p>Use this notice as the first poster placement on the site.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="rounded-3xl border border-border bg-white p-8 sm:p-10 shadow-xl flex flex-col justify-between gap-6">
              <div>
                <p className="text-sm font-semibold text-primary uppercase tracking-[0.25em] mb-3">Poster Preview</p>
                <h3 className="text-2xl font-bold text-primary mb-4">{FIRST_COMPETITION.title}</h3>
                <div className="rounded-2xl border-2 border-dashed border-secondary/40 bg-secondary/5 p-6 space-y-4">
                  <p className="text-xl font-bold text-foreground">15 Aug 2026: Application opens</p>
                  <p className="text-lg text-muted-foreground">1 Sep 2026 - 5 Oct 2026: Competition period</p>
                  <p className="text-base text-foreground">
                    Kindergarten students only. Please register with the student grade so the system can unlock the competition after login.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link href="/register">
                  <Button size="lg" className="bg-primary text-white hover:bg-primary/90 font-semibold">
                    前往註冊 / Register Now
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button size="lg" variant="outline" className="font-semibold">
                    登入後查看 / View After Login
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features / About Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-primary mb-4">為什麼選擇粵一創科文化協會？ / Why Cant One Creative Innovation &amp; Culture Association?</h2>
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
