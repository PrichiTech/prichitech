/** Arată câte runde au mai rămas, fără cifre: buline pline = runde terminate. */
export function ProgressDots({ total, done }: { total: number; done: number }) {
  return (
    <div
      className="ui-dots"
      role="img"
      aria-label={`Runda ${Math.min(done + 1, total)} din ${total}`}
    >
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={
            i < done ? 'ui-dot ui-dot--done' : i === done ? 'ui-dot ui-dot--current' : 'ui-dot'
          }
        />
      ))}
    </div>
  )
}
