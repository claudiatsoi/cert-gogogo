"use client";

import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Database } from "@/types/database";

type TeacherStudent = Database["public"]["Tables"]["teacher_students"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];

type ParsedStudent = {
  student_name: string;
  student_email: string;
  grade?: string;
  parent_email?: string;
  parent_phone?: string;
};

type SendResult = {
  student_email: string;
  status: "sent" | "failed";
  message: string;
};

const SAMPLE_CSV = `student_name,student_email,grade,parent_email,parent_phone\nChan Tai Man,student1@example.com,P4,parent1@example.com,91234567\nLee Siu Ming,student2@example.com,S1,parent2@example.com,92345678`;

function parseCsvLine(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];

    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      out.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  out.push(current.trim());
  return out;
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isPhone(value: string): boolean {
  return /^[0-9+()\-\s]{6,20}$/.test(value);
}

export default function TeacherPortalPage() {
  const router = useRouter();
  const [loadingAuth, setLoadingAuth] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [teacher, setTeacher] = useState<{ id: string; name: string | null } | null>(null);
  const [accessDenied, setAccessDenied] = useState<string | null>(null);

  const [csvText, setCsvText] = useState("");
  const [students, setStudents] = useState<ParsedStudent[]>([]);
  const [parseErrors, setParseErrors] = useState<string[]>([]);
  const [results, setResults] = useState<SendResult[]>([]);
  const [roster, setRoster] = useState<TeacherStudent[]>([]);

  useEffect(() => {
    const init = async () => {
      const { data: authData } = await supabase.auth.getUser();
      const user = authData.user;

      if (!user) {
        router.push("/register?accountType=teacher");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("role, full_name")
        .eq("id", user.id)
        .single();

      if (profileError || !profile) {
        setAccessDenied("未找到帳戶資料。請先完成一般註冊。 / Profile not found. Please register first.");
        setLoadingAuth(false);
        return;
      }

      const typedProfile = profile as Pick<ProfileRow, "role" | "full_name">;
      if (typedProfile.role !== "teacher" && typedProfile.role !== "admin") {
        setAccessDenied("此頁面只供老師使用。請聯絡管理員開通教師權限。 / Teacher access required.");
        setLoadingAuth(false);
        return;
      }

      setTeacher({ id: user.id, name: typedProfile.full_name });

      const { data: rosterData } = await supabase
        .from("teacher_students")
        .select("*")
        .eq("teacher_id", user.id)
        .order("created_at", { ascending: false })
        .limit(30);

      setRoster(rosterData ?? []);
      setLoadingAuth(false);
    };

    init();
  }, [router]);

  const parseInput = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) {
      setStudents([]);
      setParseErrors([]);
      return;
    }

    const lines = trimmed
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean);

    const localErrors: string[] = [];
    let startIndex = 0;

    if (lines.length > 0) {
      const firstCols = parseCsvLine(lines[0]).map((v) => v.toLowerCase());
      const looksLikeHeader = firstCols.some((v) => v.includes("name") || v.includes("email") || v.includes("grade"));
      if (looksLikeHeader) {
        startIndex = 1;
      }
    }

    const parsed: ParsedStudent[] = [];
    const seen = new Set<string>();

    for (let idx = startIndex; idx < lines.length; idx += 1) {
      const cols = parseCsvLine(lines[idx]);
      const rowNumber = idx + 1;

      if (cols.length < 2) {
        localErrors.push(`Line ${rowNumber}: need at least student_name,student_email`);
        continue;
      }

      const student_name = cols[0]?.trim();
      const student_email = cols[1]?.trim().toLowerCase();
      const grade = cols[2]?.trim() || undefined;
      const parent_email = cols[3]?.trim().toLowerCase() || undefined;
      const parent_phone = cols[4]?.trim() || undefined;

      if (!student_name) {
        localErrors.push(`Line ${rowNumber}: student_name is required`);
        continue;
      }

      if (!student_email || !isEmail(student_email)) {
        localErrors.push(`Line ${rowNumber}: invalid student_email (${student_email || "empty"})`);
        continue;
      }

      if (parent_email && !isEmail(parent_email)) {
        localErrors.push(`Line ${rowNumber}: invalid parent_email (${parent_email})`);
        continue;
      }

      if (parent_phone && !isPhone(parent_phone)) {
        localErrors.push(`Line ${rowNumber}: invalid parent_phone (${parent_phone})`);
        continue;
      }

      if (seen.has(student_email)) {
        localErrors.push(`Line ${rowNumber}: duplicated student_email (${student_email})`);
        continue;
      }

      seen.add(student_email);
      parsed.push({ student_name, student_email, grade, parent_email, parent_phone });
    }

    setStudents(parsed);
    setParseErrors(localErrors);
  };

  const onCsvChange = (value: string) => {
    setCsvText(value);
    parseInput(value);
  };

  const onFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    onCsvChange(content);
  };

  const canSend = useMemo(
    () => Boolean(teacher) && students.length > 0 && parseErrors.length === 0 && !submitting,
    [teacher, students.length, parseErrors.length, submitting],
  );

  const sendMagicLinks = async () => {
    if (!teacher || !canSend) return;

    setSubmitting(true);
    setResults([]);
    const newResults: SendResult[] = [];

    for (const student of students) {
      const { error: upsertError } = await supabase.from("teacher_students").upsert(
        {
          teacher_id: teacher.id,
          student_name: student.student_name,
          student_email: student.student_email,
          grade: student.grade ?? null,
          parent_email: student.parent_email ?? null,
          parent_phone: student.parent_phone ?? null,
        },
        { onConflict: "teacher_id,student_email" },
      );

      if (upsertError) {
        newResults.push({
          student_email: student.student_email,
          status: "failed",
          message: `DB error: ${upsertError.message}`,
        });
        continue;
      }

      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: student.student_email,
        options: {
          emailRedirectTo: `${window.location.origin}/register`,
          data: {
            full_name: student.student_name,
            school_grade: student.grade ?? null,
            invited_by_teacher: teacher.id,
          },
        },
      });

      if (otpError) {
        newResults.push({
          student_email: student.student_email,
          status: "failed",
          message: `Magic link failed: ${otpError.message}`,
        });
        continue;
      }

      await supabase
        .from("teacher_students")
        .update({ magic_link_sent_at: new Date().toISOString() })
        .eq("teacher_id", teacher.id)
        .eq("student_email", student.student_email);

      newResults.push({
        student_email: student.student_email,
        status: "sent",
        message: "Magic link sent",
      });
    }

    setResults(newResults);

    const { data: rosterData } = await supabase
      .from("teacher_students")
      .select("*")
      .eq("teacher_id", teacher.id)
      .order("created_at", { ascending: false })
      .limit(30);

    setRoster(rosterData ?? []);
    setSubmitting(false);
  };

  if (loadingAuth) {
    return <div className="container mx-auto py-12 px-4">Loading teacher portal...</div>;
  }

  if (accessDenied) {
    return (
      <div className="container mx-auto py-12 px-4 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>教師入口 / Teacher Portal</CardTitle>
            <CardDescription>{accessDenied}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              管理員可在 Supabase 將你的 profile.role 設為 teacher。 / Ask admin to set your profile.role to teacher.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">教師入口 / Teacher Portal</h1>
        <p className="text-muted-foreground mt-2">
          歡迎 {teacher?.name || "Teacher"}。上傳學生名單後，系統會逐一發送魔法登入連結。 / Bulk upload students and send magic links.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>批量上傳 / Bulk Upload</CardTitle>
          <CardDescription>
            CSV columns: student_name, student_email, grade, parent_email, parent_phone
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Upload CSV File</label>
            <Input type="file" accept=".csv,text/csv" onChange={onFileUpload} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Or Paste CSV</label>
            <textarea
              className="w-full min-h-48 rounded-md border border-input bg-background p-3 text-sm"
              value={csvText}
              onChange={(e) => onCsvChange(e.target.value)}
              placeholder={SAMPLE_CSV}
            />
          </div>

          {students.length > 0 && (
            <div className="rounded-md border p-3 bg-muted/20">
              <p className="font-medium mb-2">Preview ({students.length})</p>
              <div className="max-h-48 overflow-auto text-sm space-y-1">
                {students.map((student) => (
                  <div key={student.student_email} className="flex items-center justify-between gap-4">
                    <span>
                      {student.student_name}
                      {student.parent_phone ? ` (${student.parent_phone})` : ""}
                    </span>
                    <span className="text-muted-foreground">{student.student_email}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {parseErrors.length > 0 && (
            <div className="rounded-md border border-destructive/40 bg-destructive/5 p-3 text-sm text-destructive space-y-1">
              {parseErrors.map((err) => (
                <p key={err}>{err}</p>
              ))}
            </div>
          )}

          <Button onClick={sendMagicLinks} disabled={!canSend} className="w-full sm:w-auto">
            {submitting ? "Sending..." : "Send Magic Links"}
          </Button>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>結果 / Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            {results.map((result) => (
              <p key={`${result.student_email}-${result.status}`} className={result.status === "sent" ? "text-green-700" : "text-destructive"}>
                {result.student_email}: {result.message}
              </p>
            ))}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>最近學生名單 / Recent Student Records</CardTitle>
        </CardHeader>
        <CardContent>
          {roster.length === 0 ? (
            <p className="text-sm text-muted-foreground">No records yet.</p>
          ) : (
            <div className="space-y-2 text-sm">
              {roster.map((row) => (
                <div key={row.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-md border p-3 gap-1">
                  <div>
                    <p className="font-medium">{row.student_name}</p>
                    <p className="text-muted-foreground">{row.student_email}</p>
                    {row.parent_phone ? <p className="text-muted-foreground">Tel: {row.parent_phone}</p> : null}
                  </div>
                  <div className="text-muted-foreground text-xs sm:text-sm">
                    {row.magic_link_sent_at
                      ? `Magic link sent: ${new Date(row.magic_link_sent_at).toLocaleString()}`
                      : "Magic link not sent yet"}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
