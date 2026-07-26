"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Database } from "@/types/database";
import { FIRST_COMPETITION, getFirstCompetitionPhase, isKindergartenGrade } from "@/lib/competition";

type Question = Database["public"]["Tables"]["questions"]["Row"];

export default function CompetitionPage() {
  const { id } = useParams();
  const router = useRouter();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [cheatWarning, setCheatWarning] = useState(false);
  const [accessMessage, setAccessMessage] = useState<string | null>(null);
  const cheatCount = useRef(0);

  // Anti-Cheat: Visibility Change
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        cheatCount.current += 1;
        setCheatWarning(true);
        // Optionally deduct points or disqualify
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, []);

  // Fetch Questions
  useEffect(() => {
    const fetchQuestions = async () => {
      if (!id) return;

      const competitionPhase = getFirstCompetitionPhase();
      if (competitionPhase !== "live") {
        setAccessMessage(
          `此比賽暫未開始。/ This competition is not live yet. Application opens on ${FIRST_COMPETITION.applicationStartLabel}, and the competition runs from ${FIRST_COMPETITION.competitionStartLabel} to ${FIRST_COMPETITION.competitionEndLabel}.`,
        );
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setAccessMessage("請先登入才能參加比賽。/ Please log in before joining the competition.");
        setLoading(false);
        router.push("/register");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("school_grade")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("Failed to load profile:", profileError);
        setAccessMessage("未能驗證學生資料。/ Unable to verify student profile.");
        setLoading(false);
        return;
      }

      if (!isKindergartenGrade(profile?.school_grade)) {
        setAccessMessage("首場比賽只限幼稚園學生。/ This competition is for kindergarten students only.");
        setLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from("questions")
          .select("*")
          .eq("competition_id", id);
        
        if (error) throw error;
        setQuestions(data || []);
      } catch (err) {
        console.error("Failed to fetch questions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [id, router]);

  const currentQuestion = questions[currentIndex];

  // Memoize shuffled options to prevent re-shuffle on re-render
  const currentOptions = useMemo(() => {
    if (!currentQuestion) return [];
    const opts = [
      currentQuestion.correct_answer,
      currentQuestion.distractor_1,
      currentQuestion.distractor_2,
      currentQuestion.distractor_3
    ];
    // Simple shuffle
    return opts.sort(() => Math.random() - 0.5);
  }, [currentQuestion]);


  const handleOptionClick = async (option: string) => {
    if (submitting) return;

    let newScore = score;
    if (option === currentQuestion.correct_answer) {
      newScore = score + 1;
      setScore(newScore);
    }

    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      await finishCompetition(newScore);
    }
  };

  const finishCompetition = async (finalScoreCount: number) => {
      setSubmitting(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
             alert("錯誤：未能找到用戶資料，請重新登入。/ Error: User session not found.");
             router.push("/register");
             return;
        }

        if (getFirstCompetitionPhase() !== "live") {
          alert("首場比賽尚未開放。/ The competition is not live yet.");
          return;
        }

        const percentageScore = Math.round((finalScoreCount / questions.length) * 100);
        
        let tier = "Participation";
        if (percentageScore >= 100) tier = "Honour";
        else if (percentageScore >= 90) tier = "Gold";
        else if (percentageScore >= 80) tier = "Silver";
        else if (percentageScore >= 70) tier = "Bronze";

        const { error } = await supabase.from("submissions").insert([
            {
                user_id: user.id,
                competition_id: id as string,
                raw_score: percentageScore,
                tier: tier,
                payment_status: 'unpaid'
            }
        ]);

        if (error) throw error;
        
        router.push("/thank-you");

      } catch (err) {
          console.error("Error submitting:", err);
          alert("提交失敗，請重試。/ Submission failed. Please try again.");
          setSubmitting(false);
      }
  };

  const speakQuestion = () => {
    if (!currentQuestion) return;
    const utterance = new SpeechSynthesisUtterance(currentQuestion.question_text);
    // 'zh-HK' for Cantonese
    utterance.lang = 'zh-HK'; 
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  if (loading) return <div className="flex h-screen items-center justify-center">載入比賽中... / Loading Competition...</div>;
  if (accessMessage) {
    return (
      <div className="container mx-auto max-w-2xl py-16 px-4">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl">比賽未開放 / Competition Unavailable</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-muted-foreground leading-relaxed">
            <p>{accessMessage}</p>
            <p>
              {FIRST_COMPETITION.title} · {FIRST_COMPETITION.applicationStartLabel} / {FIRST_COMPETITION.competitionStartLabel} - {FIRST_COMPETITION.competitionEndLabel}
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }
  if (!currentQuestion) return <div className="flex h-screen items-center justify-center">未能找到問題。/ No questions found.</div>;

  const progress = ((currentIndex + 1) / questions.length) * 100;

  return (
    <div className="container mx-auto max-w-2xl py-12 px-4">
      <div className="mb-6 space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
           <span>問題 / Question {currentIndex + 1} / {questions.length}</span>
           <span>進度 / Progress: {Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {cheatWarning && (
           <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded mb-6 text-center animate-pulse font-medium">
               ⚠️ 警告：不允許切換分頁！此行為已被記錄。<br/>Warning: Switching tabs is not allowed! This incident has been recorded.
           </div>
      )}

      <Card className="mb-8 shadow-md">
        <CardHeader>
           <CardTitle className="text-xl leading-relaxed font-medium">
               {currentQuestion.question_text}
           </CardTitle>
        </CardHeader>
        <CardContent>
           {currentQuestion.type === 'word' && (
               <Button 
                 variant="outline" 
                 onClick={speakQuestion} 
                 className="w-full mb-6 flex items-center justify-center gap-2 h-12 text-lg border-primary/20 text-primary hover:bg-primary/5"
                 disabled={isSpeaking}
               >
                 {isSpeaking ? "播放中... / Speaking..." : "🔊 播放語音 / Play Audio"}
               </Button>
           )}

           <div className="grid gap-4 mt-4">
               {currentOptions.map((opt, idx) => (
                   <Button 
                      key={idx} 
                      className="w-full justify-start h-auto py-4 px-6 text-lg hover:bg-primary/10 hover:text-primary border border-input hover:border-primary/50 bg-white text-foreground transition-all duration-200"
                      variant="ghost"
                      onClick={() => handleOptionClick(opt)}
                      disabled={submitting}
                   >
                     {opt}
                   </Button>
               ))}
           </div>
        </CardContent>
      </Card>
      
      {submitting && <div className="text-center text-muted-foreground animate-pulse">正在提交成績... / Submitting your results...</div>}
    </div>
  );
}
