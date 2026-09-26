import { Fragment } from 'react';
import type { Clue, WordPart } from '../types';
import { JourneyTrail } from './JourneyTrail';
import { LanguageName } from './LanguageName';
import { RootForm } from './RootForm';

function article(lang: string): string {
  return lang !== 'PIE' && /^[aeiou]/i.test(lang) ? 'an' : 'a';
}

const quote = (gloss: string) => `‘${gloss}’`;

function PartsList({ parts, showForms }: { parts: WordPart[]; showForms: boolean }) {
  if (!showForms) {
    return <>Built from parts meaning {parts.map((p) => quote(p.gloss ?? '')).join(' + ')}.</>;
  }
  const sharedLang = parts.every((p) => p.lang && p.lang === parts[0].lang) ? parts[0].lang : undefined;
  return (
    <>
      Built from {sharedLang && <><LanguageName lang={sharedLang} /> </>}
      {parts.map((part, i) => (
        <Fragment key={i}>
          {i > 0 && ' + '}
          {!sharedLang && part.lang && <><LanguageName lang={part.lang} /> </>}
          <RootForm>{part.form}</RootForm>
          {part.gloss && ` ${quote(part.gloss)}`}
        </Fragment>
      ))}
      .
    </>
  );
}

export function ClueContent({ clue }: { clue: Clue }) {
  switch (clue.kind) {
    case 'text':
      return <>{clue.text}</>;
    case 'journey':
      return <JourneyTrail stops={clue.stops} />;
    case 'meaning':
      return (
        <>
          {clue.uncertain ? 'May trace back' : 'Traces back'} to {article(clue.lang)} <LanguageName lang={clue.lang} />{' '}
          {clue.lang === 'PIE' ? 'root' : 'word'} meaning {quote(clue.gloss)}.
        </>
      );
    case 'parts':
      return <PartsList parts={clue.parts} showForms={clue.showForms} />;
    case 'source':
      return (
        <>
          {clue.sameSpelling ? 'Same spelling in ' : clue.uncertain ? 'Perhaps from ' : 'From '}
          <LanguageName lang={clue.lang} />
          {clue.sameSpelling ? ': ' : ' '}
          <RootForm>{clue.form}</RootForm>
          {clue.gloss && `, ${quote(clue.gloss)}`}.
        </>
      );
    case 'related':
      return (
        <>
          Related to the English {clue.words.length === 1 ? 'word' : 'words'}{' '}
          {clue.words.map((word, i) => (
            <Fragment key={word}>
              {i > 0 && (i === clue.words.length - 1 ? ' and ' : ', ')}
              <RootForm>{word}</RootForm>
            </Fragment>
          ))}
          .
        </>
      );
  }
}
