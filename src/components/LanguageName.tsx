const FULL_NAMES: Record<string, string> = {
  PIE: 'Proto-Indo-European',
};

/** A language label; abbreviations get their full name as a tooltip. */
export function LanguageName({ lang }: { lang: string }) {
  const full = FULL_NAMES[lang];
  return full ? <abbr title={full}>{lang}</abbr> : <>{lang}</>;
}
