"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export default function RegisterOrLoginPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    grade: "",
    password: "",
  });
  const [isLogin, setIsLogin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { email, password, fullName, phone, grade } = formData;

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        router.push("/dashboard");
      } else {
        // Sign Up
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              phone: phone,
              school_grade: grade,
            },
          },
        });

        if (authError) throw authError;

        if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: authData.user.id,
                full_name: fullName,
                phone: phone,
                school_grade: grade,
              },
            ]);

            if (profileError) {
                console.error("Profile creation error:", profileError);
            }
        }

        router.push("/dashboard");
      }
    } catch (err: any) {
      // Basic translation for common errors
      let msg = err.message;
      if (msg.includes("Invalid login")) msg = "登入失敗：電郵或密碼錯誤 / Invalid login credentials";
      if (msg.includes("Password should be")) msg = "密碼太短 / Password too short";
      setError(msg || "發生錯誤 / An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setError("請先輸入電郵以重設密碼 / Please enter your email first.");
      return;
    }
    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: `${window.location.origin}/reset-password`, 
      });
      if (error) throw error;
      alert("密碼重設連結已發送至您的電郵！/ Password reset link sent!");
    } catch (err: any) {
        setError(err.message || "發送失敗 / Failed to send email.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] bg-muted/20 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            {isLogin ? "歡迎回來 / Welcome Back" : "建立帳戶 / Create Account"}
          </CardTitle>
          <CardDescription className="text-center">
            {isLogin
              ? "請輸入電郵登入 / Enter email to sign in"
              : "請輸入資料註冊 / Enter details to register"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    學生全名 / Child's Full Name
                  </label>
                  <Input
                    id="fullName"
                    name="fullName"
                    placeholder="例如: 陳大文 / e.g. Chan Tai Man"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                   <label htmlFor="phone" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    家長電話 / Parent's Phone number
                  </label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="1234 5678"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                   <label htmlFor="grade" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    年級 / Grade
                  </label>
                  <select
                    id="grade"
                    name="grade"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={formData.grade}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="" disabled>選擇年級 / Select Grade</option>
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={`P${g}`} value={`P${g}`}>小{g} / Primary {g}</option>
                    ))}
                    {[1, 2, 3, 4, 5, 6].map((g) => (
                      <option key={`S${g}`} value={`S${g}`}>中{g} / Secondary {g}</option>
                    ))}
                  </select>
                </div>
              </>
            )}

            <div className="space-y-2">
               <label htmlFor="email" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                家長電郵 / Parent's Email
              </label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="name@example.com"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
               <label htmlFor="password" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                密碼 / Password
              </label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
            </div>

            {error && <div className="text-sm text-destructive font-medium">{error}</div>}
            
            <Button className="w-full bg-primary text-white hover:bg-primary/90" type="submit" disabled={loading}>
              {loading ? "處理中... / Processing..." : isLogin ? "登入 / Sign In" : "建立帳戶 / Create Account"}
            </Button>
          </form>

          {isLogin && (
             <div className="mt-4 text-center">
                 <button 
                    type="button" 
                    onClick={handleForgotPassword}
                    className="text-sm text-primary hover:underline"
                 >
                    忘記密碼？ / Forgot Password?
                 </button>
             </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
            <div className="text-sm text-center text-muted-foreground">
                {isLogin ? "沒有帳戶？ / Don't have an account? " : "已有帳戶？ / Already have an account? "}
                <button 
                    type="button" 
                    onClick={() => setIsLogin(!isLogin)}
                    className="text-primary hover:underline font-medium"
                >
                    {isLogin ? "註冊 / Sign Up" : "登入 / Log In"}
                </button>
            </div>
        </CardFooter>
      </Card>
    </div>
  );
}
