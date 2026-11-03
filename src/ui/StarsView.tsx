/** Cele 3 stele de la finalul unui joc; cele câștigate apar una după alta. */
export function StarsView({ count }: { count: number }) {
  return (
    <div className="ui-stars" role="img" aria-label={`${count} din 3 stele`}>
      {[1, 2, 3].map((n) => (
        <span
          key={n}
          className={n <= count ? 'ui-star ui-star--on' : 'ui-star'}
          style={{ animationDelay: `${n * 0.25}s` }}
        >
          ★
        </span>
      ))}
    </div>
  )
}
