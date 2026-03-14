import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ThankYouPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4 bg-muted/20">
      <div className="bg-white p-8 rounded-xl shadow-lg border border-border max-w-md w-full">
          <div className="text-6xl mb-6">🎉</div>
          <h1 className="text-3xl font-bold mb-4 text-primary">比賽完成！<br/>Competition Complete!</h1>
          <p className="text-muted-foreground mb-8 text-lg">
            感謝您的參與。您的成績已成功提交。<br/>
            Thank you for participating. Your results have been submitted successfully.
          </p>
          
          <div className="space-y-4">
            <Link href="/dashboard" className="block w-full">
              <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold">
                查看儀表板 / View Dashboard
              </Button>
            </Link>
            
            <Link href="/" className="block w-full">
              <Button variant="outline" className="w-full">
                返回首頁 / Back to Home
              </Button>
            </Link>
          </div>
      </div>
    </div>
  );
}
