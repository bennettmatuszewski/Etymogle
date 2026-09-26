import type { JourneyStop } from '../types';
import { ChevronIcon } from './icons';
import { LanguageName } from './LanguageName';

const CHIP = 'inline-flex items-center rounded-[20px] px-2.5 py-1 text-[13px] leading-none';

export function JourneyTrail({ stops }: { stops: JourneyStop[] }) {
  const nativeOnly = stops.length === 1;

  return (
    <div className="flex flex-col gap-2">
      <span>{nativeOnly ? 'No older source on record — the trail starts in English.' : 'Its route into English:'}</span>
      <ol aria-label="Route into English" className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
        {stops.map((stop, i) => {
          const isEnglish = i === stops.length - 1;
          const tone = isEnglish
            ? 'bg-accent font-semibold text-white'
            : stop.uncertain
              ? 'border border-dashed border-lock text-muted'
              : 'bg-chip text-ink';
          return (
            <li
              key={`${stop.lang}-${i}`}
              className="flex items-center gap-1.5 motion-safe:animate-chip-in"
              style={{ animationDelay: `${250 + i * 110}ms` }}
            >
              {i > 0 && <ChevronIcon className="size-3 shrink-0 text-faint" />}
              <span className={`${CHIP} ${tone}`}>
                <LanguageName lang={stop.lang} />
                {stop.uncertain && <span className="sr-only"> (uncertain)</span>}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
