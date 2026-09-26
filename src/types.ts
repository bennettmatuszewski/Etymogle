/** One step in a word's ancestry, e.g. Latin `acerbus` "harsh to the taste". */
export interface RootStage {
  lang: string;
  form?: string;
  gloss?: string;
  /** The etymology hedges this link ("perhaps", "possibly"). */
  uncertain?: boolean;
}

/** One piece of a word-part breakdown, e.g. Greek `amphi-` "on both sides". */
export interface WordPart {
  lang?: string;
  form: string;
  gloss?: string;
}

/** Structured etymology, extracted verbatim from `etymology`. */
export interface Roots {
  attested: string | null;
  /** Oldest → newest, not including modern English. */
  lineage: RootStage[];
  parts: WordPart[];
}

export interface WordEntry {
  word: string;
  pos: string | null;
  crossreferences: string[];
  etymology: string;
  years: number[];
  clues: string[];
  roots?: Roots;
}

export interface JourneyStop {
  lang: string;
  uncertain?: boolean;
}

export type Clue =
  | { kind: 'text'; text: string }
  | { kind: 'journey'; stops: JourneyStop[] }
  | { kind: 'meaning'; lang: string; gloss: string; uncertain?: boolean }
  | { kind: 'parts'; parts: WordPart[]; showForms: boolean }
  | { kind: 'source'; lang: string; form: string; gloss?: string; sameSpelling: boolean; uncertain?: boolean }
  | { kind: 'related'; words: string[] };

export type GameMode = 'daily' | 'practice';

export type GameStatus = 'playing' | 'won' | 'lost';

export type GuessResult = 'correct' | 'wrong' | 'duplicate' | 'invalid';
