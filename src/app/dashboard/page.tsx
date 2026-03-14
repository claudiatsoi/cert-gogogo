"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Database } from "@/types/database";

type Competition = Database["public"]["Tables"]["competitions"]["Row"];
type Submission = Database["public"]["Tables"]["submissions"]["Row"];

export default function Dashboard() {
  const router = useRouter();
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          router.push("/register");
          return;
        }
        setUser(user);

        // Fetch user's latest submission
        const { data: submissions, error: submissionError } = await supabase
          .from("submissions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1);

        if (submissionError) throw submissionError;

        if (submissions && submissions.length > 0) {
          setSubmission(submissions[0]);
        } else {
            // Fetch active competitions if no submission
            const { data: fetchedCompetitions, error: compError } = await supabase
            .from("competitions")
            .select("*")
            .eq("is_active", true);

            if (compError) throw compError;
            setCompetitions(fetchedCompetitions || []);
        }

      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  const getTierInfo = (score: number) => {
    if (score >= 100) return { tier: "榮譽 / Honour", level: "honour" };
    if (score >= 90) return { tier: "金獎 / Gold", level: "gold" };
    if (score >= 80) return { tier: "銀獎 / Silver", level: "silver" };
    if (score >= 70) return { tier: "銅獎 / Bronze", level: "bronze" };
    return { tier: "參與獎 / Participation", level: "participation" };
  };

  const handlePayment = async () => {
    // Placeholder for Stripe Checkout
    alert("正在轉向付款頁面... / Redirecting to Stripe Checkout...");
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">載入中... / Loading...</div>;
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">學生儀表板 / Student Dashboard</h1>

      {submission ? (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>比賽成績 / Competition Results</CardTitle>
              <CardDescription>您的最新表現摘要 / Your latest performance.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                  <span className="font-semibold text-lg">分數 / Score</span>
                  <span className="text-xl font-bold">--- / ---</span> 
                </div>
                <div className="flex items-center justify-between p-4 bg-muted rounded-lg border-2 border-secondary">
                  <span className="font-semibold text-lg">成就等級 / Achievement Level</span>
                  <span className="text-2xl font-bold text-primary">{getTierInfo(submission.raw_score).tier}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-secondary bg-accent/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🎉 領取獎勵 / Claim Your Reward
              </CardTitle>
            </CardHeader>
            <CardContent>
                {getTierInfo(submission.raw_score).level === 'participation' ? (
                    <div className="space-y-4">
                        <p className="text-lg">感謝您的參與！這是一次寶貴的學習經驗。<br/>Congratulations on your effort! Keep growing.</p>
                        <p className="font-medium">只需 <span className="text-2xl font-bold text-primary">$50</span> 即可獲得電子成長證書。<br/>Get your e-certificate of growth for only $50.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-lg">表現優異！<br/>Outstanding performance!</p>
                        <p className="font-medium">只需 <span className="text-2xl font-bold text-primary">$150</span> 即可訂購官方獎盃和實體證書。<br/>Order your official trophy and printed certificate for $150.</p>
                    </div>
                )}
            </CardContent>
            <CardFooter>
                 <Button size="lg" className="w-full bg-secondary text-secondary-foreground hover:bg-secondary/90 font-bold" onClick={handlePayment}>
                    立即付款 / Pay Now
                 </Button>
            </CardFooter>
          </Card>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-full mb-4">
                <h2 className="text-2xl font-semibold">進行中的比賽 / Available Competitions</h2>
                <p className="text-muted-foreground">請選擇一個比賽開始 / Select a competition to start.</p>
            </div>
          
          {competitions.length === 0 ? (
              <p className="text-muted-foreground col-span-full">暫時沒有進行中的比賽 / No active competitions at the moment.</p>
          ) : (
              competitions.map((comp) => (
                <Card key={comp.id} className="flex flex-col">
                  <CardHeader>
                    <CardTitle>{comp.title}</CardTitle>
                    <CardDescription>{comp.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="flex justify-between items-center text-sm text-muted-foreground mt-2">
                         <span>費用 / Fee: ${(comp.registration_fee_cents / 100).toFixed(2)}</span>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                        className="w-full" 
                        onClick={() => router.push(`/compete/${comp.id}`)}
                    >
                      開始比賽 / Start Competition
                    </Button>
                  </CardFooter>
                </Card>
              ))
          )}
        </div>
      )}
    </div>
  );
}
