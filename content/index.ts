import type { Locale } from "@/lib/routes";
import type { Dictionary } from "./types";
import { en } from "./en";
import { nl } from "./nl";

const DICTS: Record<Locale, Dictionary> = { en, nl };

export function getDictionary(locale: Locale): Dictionary {
  return DICTS[locale];
}
export type { Dictionary } from "./types";
