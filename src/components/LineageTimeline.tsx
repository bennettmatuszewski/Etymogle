import type { WordEntry } from '../types';
import { formatAttested } from '../lib/puzzle';
import { LanguageName } from './LanguageName';

interface TimelineNodeProps {
  lang: string;
  form?: string;
  gloss?: string;
  meta?: string;
  uncertain?: boolean;
  current?: boolean;
  /** Position in the timeline, for the staggered reveal. */
  step: number;
}

function TimelineNode({ lang, form, gloss, meta, uncertain, current, step }: TimelineNodeProps) {
  return (
    <li
      className="relative flex flex-col gap-0.5 pl-6 motion-safe:animate-rise-in"
      style={{ animationDelay: `${300 + step * 110}ms` }}
    >
      <span
        aria-hidden="true"
        className={`absolute top-[2px] left-0 size-2.5 rounded-full ${
          current ? 'bg-accent' : 'border-[1.5px] border-lock bg-card'
        }`}
      />
      <span className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted">
        <LanguageName lang={lang} />
        {uncertain && ' · perhaps'}
        {meta && ` · ${meta}`}
      </span>
      {form && <span className="font-serif text-[18px] italic leading-tight text-ink">{form}</span>}
      {gloss && <span className="text-[14px] leading-snug text-muted">‘{gloss.replace(/(?<!etc)\.$/, '')}’</span>}
    </li>
  );
}

/** The word's ancestry, oldest first, ending with its arrival in English. */
export function LineageTimeline({ entry }: { entry: WordEntry }) {
  const lineage = entry.roots?.lineage ?? [];
  const attested = entry.roots?.attested;

  return (
    <ol className="relative flex flex-col gap-4 before:absolute before:top-2 before:bottom-2 before:left-[4px] before:w-[1.5px] before:bg-lock">
      {lineage.map((stage, i) => (
        <TimelineNode key={i} step={i} lang={stage.lang} form={stage.form} gloss={stage.gloss} uncertain={stage.uncertain} />
      ))}
      <TimelineNode
        step={lineage.length}
        lang="English"
        form={entry.word}
        gloss={entry.clues[0]}
        meta={attested ? formatAttested(attested).label : undefined}
        current
      />
    </ol>
  );
}
