export const FIRST_COMPETITION = {
  title: "第 1 屆幼稚園比賽 / 1st Kindergarten Competition",
  applicationStart: new Date("2026-08-15T00:00:00+08:00"),
  competitionStart: new Date("2026-09-01T00:00:00+08:00"),
  competitionEnd: new Date("2026-10-05T23:59:59+08:00"),
  applicationStartLabel: "15 Aug 2026",
  competitionStartLabel: "1 Sep 2026",
  competitionEndLabel: "5 Oct 2026",
} as const;

export type CompetitionPhase = "upcoming" | "application" | "live" | "closed";

export function getFirstCompetitionPhase(now = new Date()): CompetitionPhase {
  if (now < FIRST_COMPETITION.applicationStart) {
    return "upcoming";
  }

  if (now < FIRST_COMPETITION.competitionStart) {
    return "application";
  }

  if (now <= FIRST_COMPETITION.competitionEnd) {
    return "live";
  }

  return "closed";
}

export function isKindergartenGrade(grade?: string | null): boolean {
  if (!grade) return false;

  const normalized = grade.trim().toLowerCase();
  return normalized.includes("kindergarten") || /^k[1-3]$/.test(normalized);
}
