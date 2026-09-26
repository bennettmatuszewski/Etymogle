/** A foreign or reconstructed word form, set in italic serif like a dictionary entry. */
export function RootForm({ children }: { children: string }) {
  return <i className="font-serif text-[16px] italic text-ink">{children}</i>;
}
