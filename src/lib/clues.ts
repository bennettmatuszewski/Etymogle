import type { Clue, JourneyStop, RootStage, Roots, WordEntry, WordPart } from '../types';
import { MAX_GUESSES, formatAttested } from './puzzle';

const MASK_DOT = '·';

/** Letters only, lowercase, accents stripped — for comparing forms against the answer. */
function letters(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z]/g, '');
}

function sameText(a: string, b: string): boolean {
  return letters(a) === letters(b);
}

/** Keeps a form's leading `*`/`-`, first letter and trailing `-`: "back" → "b···", "-ful" → "-f··". */
export function maskForm(form: string): string {
  const match = form.match(/^([*-]*)(.)(.*?)(-*)$/u);
  if (!match) return form;
  const [, lead, first, rest, trail] = match;
  return lead + first + MASK_DOT.repeat([...rest].length) + trail;
}

function sharedPrefix(a: string, b: string): number {
  let i = 0;
  while (i < a.length && i < b.length && a[i] === b[i]) i++;
  return i;
}

/** A word in clue text leaks if it's the answer, part of it (fire → backfire) or shares its stem (engraved → engraving). */
function wordLeaks(word: string, answer: string): boolean {
  const w = letters(word);
  const a = letters(answer);
  if (w.length < 4) return w === a;
  return a.includes(w) || sharedPrefix(w, a) >= Math.min(5, a.length - 1);
}

/** Masks words in clue text that would give the answer away. */
export function redact(text: string, answer: string): string {
  return text.replace(/\p{L}+/gu, (word) => (wordLeaks(word, answer) ? maskForm(word) : word));
}

/** A form gives the answer away if it contains it, or is the answer minus a letter or two. */
function formLeaks(form: string, answer: string): boolean {
  const f = letters(form);
  const a = letters(answer);
  if (!f) return false;
  return f.includes(a) || (a.includes(f) && f.length >= a.length - 2);
}

const isAffix = (form: string) => form.startsWith('-') || form.endsWith('-');

/** Transparent compounds (back + fire) spell the answer, so their stems are masked; affixes like -ly stay. */
function guardParts(parts: WordPart[], answer: string): WordPart[] {
  const a = letters(answer);
  const spellsAnswer = parts.map((p) => letters(p.form)).join('') === a;
  return parts.map((part) => {
    const f = letters(part.form);
    const hide = (spellsAnswer && !isAffix(part.form)) || (f.length >= 4 && a.includes(f));
    return {
      ...part,
      form: hide ? maskForm(part.form) : part.form,
      gloss: part.gloss && redact(part.gloss, answer),
    };
  });
}

function journeyClue(roots: Roots): Clue {
  const stops: JourneyStop[] = [];
  const add = (lang: string, uncertain?: boolean) => {
    const last = stops.at(-1);
    if (last?.lang === lang) last.uncertain = last.uncertain && uncertain;
    else stops.push({ lang, uncertain });
  };
  // "from Latin caro + levare": the parts' language comes before the first recorded form.
  const partsLang = roots.parts[0]?.lang;
  if (partsLang && partsLang !== roots.lineage[0]?.lang) add(partsLang);
  roots.lineage.forEach((stage) => add(stage.lang, stage.uncertain));
  add('English');
  return { kind: 'journey', stops };
}

function attestedClue(attested: string | null): Clue {
  return {
    kind: 'text',
    text: attested
      ? `First recorded in English ${formatAttested(attested).phrase}.`
      : 'No firm early date survives in the record.',
  };
}

/** Clue 3: what the parts or the oldest ancestor meant — never the forms themselves. */
function meaningClue(entry: WordEntry, roots: Roots): { clue: Clue; shown?: string } {
  const answer = entry.word;
  const { parts, lineage } = roots;
  if (parts.length >= 2 && parts.every((p) => p.gloss)) {
    return { clue: { kind: 'parts', parts: guardParts(parts, answer), showForms: false } };
  }
  // Skip meanings that repeat clue 4, or that just restate the form (Middle French grenade "grenade").
  const stage = lineage.find(
    (s) => s.gloss && !sameText(s.gloss, entry.clues[0]) && !(s.form && sameText(s.gloss, s.form)),
  );
  if (stage?.gloss) {
    return {
      clue: { kind: 'meaning', lang: stage.lang, gloss: redact(stage.gloss, answer), uncertain: stage.uncertain },
      shown: stage.gloss,
    };
  }
  return { clue: { kind: 'text', text: redact(entry.clues[2], answer) }, shown: entry.clues[2] };
}

/** Clue 5 (near-giveaway): the actual root forms. */
function rootClue(entry: WordEntry, roots: Roots, shown: string[]): Clue {
  const answer = entry.word;
  const { parts, lineage } = roots;
  if (parts.length >= 2) return { kind: 'parts', parts: guardParts(parts, answer), showForms: true };

  const withForm = lineage.filter((s): s is RootStage & { form: string } => Boolean(s.form));
  const newest = withForm.at(-1);
  if (!newest) return relatedClue(entry);

  const glossFor = (stage: RootStage & { form: string }) =>
    stage.gloss && !sameText(stage.gloss, stage.form) && !shown.some((t) => sameText(t, stage.gloss!))
      ? redact(stage.gloss, answer)
      : undefined;
  const sameSpelling = letters(newest.form) === letters(answer);
  const masked = { lang: newest.lang, form: maskForm(newest.form), gloss: glossFor(newest), sameSpelling, uncertain: newest.uncertain };

  // Borrowed unchanged, with a meaning to go on: "Same spelling in Spanish: b·····, 'district, suburb'".
  if (sameSpelling && newest.gloss) return { kind: 'source', ...masked };

  const safe = [...withForm].reverse().find((s) => !formLeaks(s.form, answer));
  if (safe) {
    return { kind: 'source', lang: safe.lang, form: safe.form, gloss: glossFor(safe), sameSpelling: false, uncertain: safe.uncertain };
  }
  return { kind: 'source', ...masked };
}

/** Clue 5 for words made inside English: the English words etymonline cross-references. */
function relatedClue(entry: WordEntry): Clue {
  const answer = entry.word;
  const others = entry.crossreferences.filter((w) => letters(w) !== letters(answer));
  if (others.length) {
    return { kind: 'related', words: others.map((w) => (formLeaks(w, answer) ? maskForm(w) : w)) };
  }
  if (entry.crossreferences.length) {
    return { kind: 'text', text: 'Grew out of the same English word used as a different part of speech.' };
  }
  return { kind: 'text', text: redact(entry.clues[3], answer) };
}

/**
 * Five clues, hardest to easiest: the route into English, first recorded date,
 * what its roots meant, its earliest English sense, then the root forms themselves.
 */
export function getClues(entry: WordEntry): Clue[] {
  const { roots } = entry;
  if (!roots) {
    return entry.clues.slice(0, MAX_GUESSES).map((text) => ({ kind: 'text', text: redact(text, entry.word) }));
  }
  const earliestSense = entry.clues[0];
  const meaning = meaningClue(entry, roots);
  const shown = [earliestSense, ...(meaning.shown ? [meaning.shown] : [])];
  return [
    journeyClue(roots),
    attestedClue(roots.attested),
    meaning.clue,
    { kind: 'text', text: redact(earliestSense, entry.word) },
    rootClue(entry, roots, shown),
  ];
}
