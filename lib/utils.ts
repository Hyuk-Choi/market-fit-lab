import { clsx, type ClassValue } from "clsx";
import { getScoreLabel } from "@/lib/scoring";

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function scoreLabel(score: number) {
  return getScoreLabel(score);
}
